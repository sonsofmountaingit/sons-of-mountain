import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { handleCheckoutCompleted } from '@/lib/stripe-webhooks'
import { releaseCheckoutPromotions } from '@/lib/checkout-promotions'

const PENDING_ORDER_TTL_MS = 60 * 60 * 1000

export async function expirePendingOrders() {
  const payload = await getPayload({ config })
  const cutoff = new Date(Date.now() - PENDING_ORDER_TTL_MS).toISOString()
  const result = await payload.find({
    collection: 'orders',
    where: { and: [{ status: { equals: 'pending' } }, { createdAt: { less_than: cutoff } }] },
    limit: 100,
    depth: 0,
  })

  let expired = 0
  for (const order of result.docs as any[]) {
    // A paid Stripe session can outlive the browser redirect and the webhook. Reconcile
    // it before cancelling the pending order, otherwise a delayed webhook could turn a
    // legitimate paid reservation into a cancelled order.
    if (order.stripeSessionId && !stripe) {
      console.error(`[pending-orders] Stripe is unavailable; leaving order ${order.id} pending`)
      continue
    }
    if (order.stripeSessionId && stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
        if (session.status === 'complete' && ['paid', 'no_payment_required'].includes(session.payment_status)) {
          await handleCheckoutCompleted(session, payload)
          continue
        }
        if (session.status === 'complete') {
          // Completed sessions with delayed payment methods can settle later; do not
          // cancel the order while Stripe still owns a completed checkout.
          continue
        }
        if (session.status === 'open') {
          await stripe.checkout.sessions.expire(order.stripeSessionId)
        }
      } catch (error) {
        console.error(`[pending-orders] Could not reconcile order ${order.id}; leaving it pending:`, error)
        continue
      }
    }

    // Payment must be confirmed by Stripe before a pending order can become paid.
    // Expiring stale orders releases the database record without touching paid orders.
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { status: 'cancelled', paymentStatus: 'failed', checkoutFailureReason: 'Checkout expired' } as any,
      overrideAccess: true,
    })
    await releaseCheckoutPromotions(payload, order.id).catch((error) => {
      console.error(`[pending-orders] Failed to release promotions for order ${order.id}:`, error)
    })
    const rideId = typeof order.carpoolRide === 'object' ? order.carpoolRide?.id : order.carpoolRide
    if (rideId) {
      // Preserve the ride record for audit/history; only close unpaid rides.
      await payload.update({
        collection: 'carpool-rides',
        id: rideId,
        data: { status: 'closed' } as any,
        overrideAccess: true,
      }).catch(() => null)
    }
    expired += 1
  }
  return { expired }
}
