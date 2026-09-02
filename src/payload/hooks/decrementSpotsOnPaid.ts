import type { CollectionAfterChangeHook } from 'payload'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'
import { claimIdempotencyKey, releaseIdempotencyKey } from '@/lib/security/rate-limit'

// Persist a one-time marker on the order and decrement spots/stock
// so a duplicate Stripe event, recovery run, or later admin save cannot sell the same
// spots twice.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const alreadyApplied = Boolean((doc as { spotsDecrementedAt?: string | null }).spotsDecrementedAt)
  if (doc.status !== 'paid' || alreadyApplied) return doc

  const lockKey = `order-spots:${doc.id}`
  const lockToken = await claimIdempotencyKey(lockKey, 300).catch(() => null)
  if (!lockToken) return doc

  const items = doc.items ?? []
  try {
    await decrementOrderItemsSpotsAndStock(req.payload, items)
    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: { spotsDecrementedAt: new Date().toISOString() } as any,
    })
  } catch (error) {
    console.error(`Failed to decrement spots for order ${doc.id}:`, error)
  } finally {
    await releaseIdempotencyKey(lockKey, lockToken).catch(() => undefined)
  }

  return doc
}
