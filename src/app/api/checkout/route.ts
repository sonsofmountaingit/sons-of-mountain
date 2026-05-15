import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'

type CheckoutType = 'registration' | 'order' | 'voucher'

const COLLECTION_MAP: Record<CheckoutType, 'registrations' | 'orders' | 'gift-vouchers'> = {
  registration: 'registrations',
  order: 'orders',
  voucher: 'gift-vouchers',
}

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
      apiVersion: '2026-04-22.dahlia',
    })
    const body = await req.json()
    const {
      type = 'registration' as CheckoutType,
      recordId,
      // legacy support
      orderId,
      tripId,
      amount,
      currency = 'eur',
      description,
      successPath,
      cancelPath,
    } = body

    const id = recordId ?? orderId
    if (!id || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description ?? 'Sons of Mountains' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successPath
        ? `${base}${successPath}?session_id={CHECKOUT_SESSION_ID}`
        : `${base}/dashboard/registrations?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelPath ? `${base}${cancelPath}` : `${base}/`,
      metadata: { recordId: id, type, tripId: tripId ?? '' },
    })

    const payload = await getPayload({ config })
    const collection = COLLECTION_MAP[type as CheckoutType] ?? 'registrations'

    await payload.update({
      collection,
      id,
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
