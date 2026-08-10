import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { handleCheckoutCompleted } from '@/lib/stripe-webhooks'

/**
 * Safety net for an interrupted or unavailable Stripe webhook delivery.
 * Stripe webhooks remain the primary real-time path. This job finds still-pending
 * Checkout orders and completes only sessions Stripe reports as paid. The payment
 * handler and Payload hooks are idempotent, so replaying a session is safe.
 */
export async function reconcileCheckoutPayments(): Promise<{ checked: number; recovered: number }> {
  if (!stripe) throw new Error('Stripe is not configured')

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { equals: 'pending' } },
        { stripeSessionId: { exists: true } },
      ],
    },
    limit: 100,
    pagination: false,
    depth: 0,
  })

  let recovered = 0
  for (const order of docs as any[]) {
    const sessionId = order.stripeSessionId as string | undefined
    if (!sessionId) continue

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.status !== 'complete' || session.payment_status !== 'paid') continue

    await handleCheckoutCompleted(session, payload)
    recovered++
  }

  return { checked: docs.length, recovered }
}
