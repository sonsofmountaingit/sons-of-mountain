import { getPayload } from 'payload'
import config from '@payload-config'
import { hasTravelEnded } from '@/lib/travel-status'

type OrderItem = {
  itemType?: string
  trip?: string | number | { id: string | number } | null
  program?: string | number | { id: string | number } | null
  destination?: string | number | { id: string | number } | null
  quantity?: number
  participantCount?: number
}

type PaidOrder = { items?: OrderItem[] }

type Registration = {
  status?: string
  trip?: string | number | { id: string | number } | null
  program?: string | number | { id: string | number } | null
  destination?: string | number | { id: string | number } | null
  participantCount?: number
}

function relatedId(value: string | number | { id: string | number } | null | undefined): string | null {
  if (value == null) return null
  return typeof value === 'object' ? String(value.id) : String(value)
}

async function bookedSpots(payload: Awaited<ReturnType<typeof getPayload>>, itemType: 'trip' | 'program' | 'destination', itemId: string): Promise<number> {
  const [orders, registrations] = await Promise.all([
    payload.find({
      collection: 'orders',
      where: { status: { equals: 'paid' } },
      limit: 0,
      pagination: false,
      depth: 0,
    }),
    payload.find({
      collection: 'registrations',
      where: { status: { in: ['pending', 'confirmed', 'paid'] } },
      limit: 0,
      pagination: false,
      depth: 0,
    }),
  ])

  const orderSpots = (orders.docs as PaidOrder[]).reduce((total, order) => total + (order.items ?? []).reduce((itemTotal, item) => {
    if (item.itemType !== itemType || relatedId(item[itemType]) !== itemId) return itemTotal
    return itemTotal + (item.quantity ?? item.participantCount ?? 1)
  }, 0), 0)

  const registrationSpots = (registrations.docs as Registration[]).reduce((total, registration) => {
    if (relatedId(registration[itemType]) !== itemId) return total
    return total + (registration.participantCount ?? 1)
  }, 0)

  return orderSpots + registrationSpots
}

export async function runSyncSoldOut(): Promise<{ ok: true; updated: number }> {
  const payload = await getPayload({ config })

  const { docs: trips } = await payload.find({
    collection: 'trips',
    where: { and: [{ status: { not_equals: 'draft' } }, { status: { not_equals: 'archived' } }] },
    limit: 500,
    pagination: false,
  })

  let updated = 0
  for (const trip of trips) {
    const t = trip as { id: string; spotsAvailable?: number; spotsTotal?: number; endDate?: string | null }
    const spotsAvailable = Math.max(0, (t.spotsTotal ?? 0) - await bookedSpots(payload, 'trip', String(t.id)))
    const status = hasTravelEnded(t.endDate) ? 'archived' : spotsAvailable === 0 ? 'soldOut' : 'active'
    if (t.spotsAvailable !== spotsAvailable || (trip as { status?: string }).status !== status) {
      await payload.update({ collection: 'trips', id: t.id, data: { spotsAvailable, status } })
      updated++
    }
  }

  const { docs: programs } = await payload.find({
    collection: 'programs',
    where: { and: [{ status: { not_equals: 'draft' } }, { status: { not_equals: 'archived' } }] },
    limit: 500,
    pagination: false,
  })

  for (const program of programs) {
    const p = program as { id: string; spotsAvailable?: number; spotsTotal?: number; endDate?: string | null }
    const spotsAvailable = Math.max(0, (p.spotsTotal ?? 0) - await bookedSpots(payload, 'program', String(p.id)))
    const status = hasTravelEnded(p.endDate) ? 'archived' : spotsAvailable === 0 ? 'soldOut' : 'active'
    if (p.spotsAvailable !== spotsAvailable || (program as { status?: string }).status !== status) {
      await payload.update({ collection: 'programs', id: p.id, data: { spotsAvailable, status } })
      updated++
    }
  }

  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    where: { bookingStatus: { not_equals: 'archived' } },
    limit: 500,
    pagination: false,
  })

  for (const destination of destinations) {
    const d = destination as { id: string | number; spotsAvailable?: number; spotsTotal?: number }
    // Destinations do not have an end-date archive state in this model.
    const spotsAvailable = Math.max(0, (d.spotsTotal ?? 0) - await bookedSpots(payload, 'destination', String(d.id)))
    const bookingStatus = spotsAvailable === 0 ? 'soldOut' : 'active'
    if (d.spotsAvailable !== spotsAvailable || (destination as { bookingStatus?: string }).bookingStatus !== bookingStatus) {
      await payload.update({ collection: 'destinations', id: d.id, data: { spotsAvailable, bookingStatus } })
      updated++
    }
  }

  return { ok: true, updated }
}
