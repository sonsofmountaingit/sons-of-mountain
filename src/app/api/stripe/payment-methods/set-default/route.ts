import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { paymentMethodId } = await req.json()
    if (!paymentMethodId) return NextResponse.json({ error: 'paymentMethodId required' }, { status: 400 })

    const payload = await getPayload({ config })
    const custResult = await payload.find({
      collection: 'customers',
      where: { email: { equals: session.user.email } },
      limit: 1,
    })
    const customer = custResult.docs[0] as any
    if (!customer?.stripeCustomerId) return NextResponse.json({ error: 'No Stripe customer' }, { status: 400 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    await stripe.customers.update(customer.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: { defaultPaymentMethodId: paymentMethodId } as any,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
