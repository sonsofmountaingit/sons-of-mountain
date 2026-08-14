import type { CollectionAfterChangeHook } from 'payload'
import { afterResponse } from '@/lib/after-response'
import { decrementOrderItemsSpotsAndStock } from '@/lib/stripe-webhooks'

// A paid-order mutation holds a Payload transaction until its afterChange hooks
// finish. Run the stock/availability change after the response, once that
// transaction has been released.
//
// `previousDoc` is not guaranteed for every update path (notably recovery jobs).
// Persist a one-time marker on the order before scheduling the decrement so a
// duplicate Stripe event, recovery run, or later admin save cannot sell the same
// spots twice.
export const decrementSpotsOnPaid: CollectionAfterChangeHook = ({ doc, previousDoc, operation, req }) => {
  const alreadyApplied = Boolean((doc as { spotsDecrementedAt?: string | null }).spotsDecrementedAt)
  const wasPaid = operation !== 'create' && previousDoc?.status === 'paid'
  if (doc.status !== 'paid' || wasPaid || alreadyApplied) return doc

  const items = doc.items ?? []
  afterResponse(async () => {
    const current = await req.payload.findByID({ collection: 'orders', id: doc.id, depth: 0 }).catch(() => null) as { spotsDecrementedAt?: string | null } | null
    if (!current || current.spotsDecrementedAt) return

    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: { spotsDecrementedAt: new Date().toISOString() } as any,
    })
    await decrementOrderItemsSpotsAndStock(req.payload, items)
  })

  return doc
}
