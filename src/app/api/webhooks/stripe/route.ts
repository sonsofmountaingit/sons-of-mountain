import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'
import { revalidatePath, revalidateTag } from 'next/cache'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { orderId, tripId } = session.metadata ?? {}

    if (!orderId) {
      return NextResponse.json({ ok: true })
    }

    const payload = await getPayload({ config })

    await payload.update({
      collection: 'orders',
      id: orderId,
      data: { status: 'paid' },
    })

    if (tripId) {
      const order = await payload.findByID({ collection: 'orders', id: orderId })
      const trip = await payload.findByID({ collection: 'trips', id: tripId })

      if (trip && order) {
        const newSpots = Math.max(0, trip.spotsAvailable - (order.participantCount ?? 1))
        await payload.update({
          collection: 'trips',
          id: tripId,
          data: {
            spotsAvailable: newSpots,
            status: newSpots === 0 ? 'soldOut' : 'active',
          },
        })
        revalidateTag('trips', 'default')
        void revalidatePath('/destinations', 'page')
      }
    }
  }

  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
