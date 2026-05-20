import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Accept either Better Auth session or Payload JWT
    const authHeader = req.headers.get('Authorization')
    let isAdmin = false

    if (authHeader?.startsWith('JWT ')) {
      // Verify Payload JWT by calling /api/users/me equivalent
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/api/users/me`, {
        headers: { Authorization: authHeader },
      }).catch(() => null)
      if (meRes?.ok) {
        const meData = await meRes.json().catch(() => null)
        isAdmin = !!(meData?.user && meData.user.role === 'admin')
      }
    } else {
      const session = await auth.api.getSession({ headers: await headers() })
      if (session?.user) {
        const user = await payload.find({ collection: 'users', where: { email: { equals: session.user.email } }, limit: 1 })
        isAdmin = !!(user.docs[0] && (user.docs[0] as any).role === 'admin')
      }
    }

    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!

    // Fetch last 30 Stripe payouts
    const payouts = await stripe.payouts.list({ limit: 30 })

    // Fetch Stripe charges (last 100)
    const charges = await stripe.charges.list({ limit: 100 })
    const stripeChargeMap = new Map<string, any>()
    for (const charge of charges.data) {
      if (charge.payment_intent) {
        stripeChargeMap.set(charge.payment_intent as string, charge)
      }
    }

    // Fetch paid Payload orders
    const paidOrders = await payload.find({
      collection: 'orders',
      where: { status: { equals: 'paid' } },
      limit: 200,
    })

    const ghosts: any[] = [] // paid in Payload but no Stripe charge
    const mismatches: any[] = [] // amount differs
    let payloadTotal = 0

    for (const order of paidOrders.docs as any[]) {
      payloadTotal += order.totalAmount ?? 0
      if (!order.stripePaymentIntentId) {
        ghosts.push({ id: order.id, email: order.email, amount: order.totalAmount, type: 'order' })
        continue
      }
      const charge = stripeChargeMap.get(order.stripePaymentIntentId)
      if (!charge) {
        ghosts.push({ id: order.id, email: order.email, amount: order.totalAmount, type: 'order', note: 'Stripe charge not found in recent 100' })
        continue
      }
      const stripeAmount = charge.amount / 100
      if (Math.abs(stripeAmount - (order.totalAmount ?? 0)) > 0.01) {
        mismatches.push({
          id: order.id,
          email: order.email,
          payloadAmount: order.totalAmount,
          stripeAmount,
          diff: stripeAmount - (order.totalAmount ?? 0),
        })
      }
    }

    // Orphaned Stripe charges (no matching Payload order)
    const payloadPIIds = new Set(paidOrders.docs.map((o: any) => o.stripePaymentIntentId).filter(Boolean))
    const orphaned = charges.data
      .filter((c) => c.payment_intent && !payloadPIIds.has(c.payment_intent as string) && c.status === 'succeeded')
      .map((c) => ({ paymentIntentId: c.payment_intent, amount: c.amount / 100, date: new Date(c.created * 1000).toISOString() }))

    const stripeTotal = charges.data.filter((c) => c.status === 'succeeded').reduce((sum, c) => sum + c.amount / 100, 0)

    return NextResponse.json({
      payouts: payouts.data.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        currency: p.currency,
        arrivalDate: new Date(p.arrival_date * 1000).toISOString(),
        status: p.status,
      })),
      summary: {
        stripeTotal,
        payloadTotal,
        diff: stripeTotal - payloadTotal,
      },
      ghosts,
      mismatches,
      orphaned,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
