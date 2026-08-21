import type { CollectionAfterChangeHook } from 'payload'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'

// Persist a one-time marker on the order and decrement spots/stock
// so a duplicate Stripe event, recovery run, or later admin save cannot sell the same
// spots twice.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const alreadyApplied = Boolean((doc as { spotsDecrementedAt?: string | null }).spotsDecrementedAt)
  const wasPaid = operation !== 'create' && previousDoc?.status === 'paid'
  if (doc.status !== 'paid' || wasPaid || alreadyApplied) return doc

  const items = doc.items ?? []
  try {
    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: { spotsDecrementedAt: new Date().toISOString() } as any,
    })
    await decrementOrderItemsSpotsAndStock(req.payload, items)
  } catch (error) {
    console.error(`Failed to decrement spots for order ${doc.id}:`, error)
  }

  return doc
}
