import type { CollectionAfterChangeHook } from 'payload'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'
import { syncSpotsForOrderItems } from './syncTripSpots'

// A transition to paid is the sole event that consumes stock. Travel availability is
// then recalculated from the source records, rather than subtracted from a potentially
// stale cached spotsAvailable value.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const wasPaid = operation !== 'create' && previousDoc?.status === 'paid'
  if (doc.status !== 'paid' || wasPaid) return doc

  await decrementOrderItemsSpotsAndStock(req.payload, doc.items ?? [])
  await syncSpotsForOrderItems(doc.items ?? [], req.payload)
  return doc
}
