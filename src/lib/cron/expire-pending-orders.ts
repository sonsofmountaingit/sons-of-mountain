import { getPayload } from 'payload'
import config from '@payload-config'

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
    // Payment must be confirmed by Stripe before a pending order can become paid.
    // Expiring stale orders releases the database record without touching paid orders.
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { status: 'cancelled' } as any,
      overrideAccess: true,
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
