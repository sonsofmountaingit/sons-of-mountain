import type { CollectionAfterChangeHook } from 'payload'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'

// Single source of truth for spots/stock decrement — fires exactly once whenever an
// order transitions into 'paid', regardless of whether that happened via the Stripe
// webhook, a manually-generated payment link, or an admin marking it paid by hand.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const wasPaid = operation !== 'create' && previousDoc?.status === 'paid'
  if (doc.status !== 'paid' || wasPaid) return doc
  await decrementOrderItemsSpotsAndStock(req.payload, doc.items ?? [])
  return doc
}
