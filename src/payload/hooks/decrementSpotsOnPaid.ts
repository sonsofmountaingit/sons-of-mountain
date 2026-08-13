import type { CollectionAfterChangeHook } from 'payload'
import { afterResponse } from '@/lib/after-response'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'
import { syncSpotsForOrderItems } from './syncTripSpots'

// A paid-order mutation holds a Payload transaction until its afterChange hooks
// finish. Updating stock and recalculating availability performs further database
// writes, which can exhaust the pool and leave the admin save stuck on “Submitting”.
// Run the entire cascade after the response, once that transaction has been released.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = ({ doc, previousDoc, operation, req }) => {
  const wasPaid = operation !== 'create' && previousDoc?.status === 'paid'
  if (doc.status !== 'paid' || wasPaid) return doc

  const items = doc.items ?? []
  afterResponse(async () => {
    await decrementOrderItemsSpotsAndStock(req.payload, items)
    await syncSpotsForOrderItems(items, req.payload)
  })

  return doc
}
