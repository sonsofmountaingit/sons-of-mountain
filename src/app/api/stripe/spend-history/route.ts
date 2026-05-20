import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const custResult = await payload.find({
      collection: 'customers',
      where: { email: { equals: session.user.email } },
      limit: 1,
    })
    const customer = custResult.docs[0] as any
    if (!customer?.stripeCustomerId) return NextResponse.json({ lifetimeSpend: 0, averageOrderValue: 0, chargeHistory: [], nextRenewal: null })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!

    const [charges, subscriptions] = await Promise.all([
      stripe.charges.list({ customer: customer.stripeCustomerId, limit: 100 }),
      stripe.subscriptions.list({ customer: customer.stripeCustomerId, limit: 10 }),
    ])

    const succeeded = charges.data.filter((c) => c.status === 'succeeded')
    const lifetimeSpend = succeeded.reduce((sum, c) => sum + c.amount / 100, 0)
    const averageOrderValue = succeeded.length > 0 ? lifetimeSpend / succeeded.length : 0

    const nextRenewal = subscriptions.data.find((s) => s.status === 'active')
      ? new Date(((subscriptions.data.find((s) => s.status === 'active') as any).current_period_end ?? 0) * 1000).toISOString()
      : null

    return NextResponse.json({
      lifetimeSpend: Math.round(lifetimeSpend * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      chargeCount: succeeded.length,
      nextRenewal,
      chargeHistory: succeeded.map((c) => ({
        id: c.id,
        amount: c.amount / 100,
        currency: c.currency,
        description: c.description,
        date: new Date(c.created * 1000).toISOString(),
        receiptUrl: c.receipt_url,
      })),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
