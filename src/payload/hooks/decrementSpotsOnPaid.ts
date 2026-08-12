import type { CollectionAfterChangeHook } from 'payload'
import { afterResponse } from '@/lib/after-response'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'

// A paid-order mutation has an open Payload transaction while afterChange hooks
// execute. The stock/spot cascade performs more reads and writes (and may send
// wait-list notifications), so running it in that transaction can deadlock the
// checkout worker. Run it after the response with a fresh Payload request instead.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const wasPaid = operation !== 'create' && previousDoc?.status === 'paid'
  if (doc.status !== 'paid' || wasPaid) return doc

  const items = doc.items ?? []
  await afterResponse(() => decrementOrderItemsSpotsAndStock(req.payload, items))
  return doc
}
