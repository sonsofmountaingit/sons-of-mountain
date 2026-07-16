import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { headers } from 'next/headers'
import type { CartItem } from '@/lib/cart-store'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    const { amount, currency = 'eur', cartItems } = await req.json()
    if (!amount) return NextResponse.json({ error: 'amount required' }, { status: 400 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const piParams: any = {
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    }

    // Attach Stripe customer if logged in
    if (user?.collection === 'customers') {
      const customer = await payload.findByID({ collection: 'customers', id: user.id }).catch(() => null) as any
      if (customer?.stripeCustomerId) {
        piParams.customer = customer.stripeCustomerId
        piParams.setup_future_usage = 'off_session'
      }
    }

    if (cartItems?.length) {
      piParams.metadata = {
        items: JSON.stringify((cartItems as CartItem[]).map((i) => ({ id: i.tripId ?? i.productId ?? i.programId ?? i.bundleId, type: i.type }))),
      }
    }

    const pi = await stripe.paymentIntents.create(piParams)
    return NextResponse.json({ clientSecret: pi.client_secret })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
