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
async function reconcilePaidSession(
  sessionId: string,
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<boolean> {
  if (!stripe) throw new Error('Stripe is not configured')

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.status !== 'complete' || session.payment_status !== 'paid') return false

  await handleCheckoutCompleted(session, payload)
  return true
}

// The success page calls this after Stripe redirects the buyer back. This gives the
// buyer immediate confirmed order/spot data even if a webhook delivery was delayed.
export async function reconcileCheckoutSession(sessionId: string): Promise<boolean> {
  const payload = await getPayload({ config })
  return reconcilePaidSession(sessionId, payload)
}

export async function reconcileCheckoutPayments(): Promise<{ checked: number; recovered: number }> {
  if (!stripe) throw new Error('Stripe is not configured')

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { not_equals: 'paid' } },
        { stripeSessionId: { exists: true } },
      ],
    },
    // Reconcile every unpaid Checkout order, not merely the first ten. Otherwise a
    // successful payment can remain pending indefinitely when older rows fill the batch.
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'createdAt',
  })

  let recovered = 0
  for (const order of docs as any[]) {
    const sessionId = order.stripeSessionId as string | undefined
    if (!sessionId) continue

    if (await reconcilePaidSession(sessionId, payload)) recovered++
  }

  return { checked: docs.length, recovered }
}
