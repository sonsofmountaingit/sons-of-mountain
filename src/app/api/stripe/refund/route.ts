import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const user = await payload.find({ collection: 'users', where: { email: { equals: session.user.email } }, limit: 1 })
    if (!user.docs[0] || (user.docs[0] as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orderId, registrationId, amount } = await req.json()
    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!

    let paymentIntentId: string | null = null
    let collection: 'orders' | 'registrations' = 'orders'
    let docId: string

    if (orderId) {
      const order = await payload.findByID({ collection: 'orders', id: orderId })
      paymentIntentId = (order as any).stripePaymentIntentId ?? null
      docId = orderId
      collection = 'orders'
    } else if (registrationId) {
      const reg = await payload.findByID({ collection: 'registrations', id: registrationId })
      paymentIntentId = (reg as any).stripePaymentIntentId ?? null
      docId = registrationId
      collection = 'registrations'
    } else {
      return NextResponse.json({ error: 'orderId or registrationId required' }, { status: 400 })
    }

    if (!paymentIntentId) return NextResponse.json({ error: 'No payment intent on record' }, { status: 400 })

    const refundParams: any = { payment_intent: paymentIntentId }
    if (amount) refundParams.amount = Math.round(amount * 100)

    const refund = await stripe.refunds.create(refundParams)

    await payload.update({
      collection,
      id: docId,
      data: { status: 'refunded', stripeRefundId: refund.id, refundAmount: refund.amount / 100 } as any,
    })

    return NextResponse.json({ refundId: refund.id, amount: refund.amount / 100 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
