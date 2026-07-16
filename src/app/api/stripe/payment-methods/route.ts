import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { headers } from 'next/headers'

async function getStripeCustomerId(userId: string | number): Promise<string | null> {
  const payload = await getPayload({ config })
  const customer = await payload.findByID({ collection: 'customers', id: userId }).catch(() => null) as any
  return customer?.stripeCustomerId ?? null
}

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const stripeCustomerId = await getStripeCustomerId(user.id)
    if (!stripeCustomerId) return NextResponse.json({ methods: [] })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const methods = await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' })

    const customer = await stripe.customers.retrieve(stripeCustomerId) as any
    const defaultPm = (customer.invoice_settings as any)?.default_payment_method ?? null

    return NextResponse.json({
      methods: methods.data.map((pm) => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
        isDefault: pm.id === defaultPm,
      })),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const pmId = searchParams.get('id')
    if (!pmId) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    await stripe.paymentMethods.detach(pmId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
