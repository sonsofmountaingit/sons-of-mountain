import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type RegistrationDoc = {
  trip?: string | { id: string } | null
  program?: string | { id: string } | null
  destination?: string | { id: string } | null
  participantCount?: number
  status?: string
}

type OrderItem = {
  itemType?: string
  trip?: string | { id: string } | null
  program?: string | { id: string } | null
  destination?: string | { id: string } | null
  quantity?: number
  participantCount?: number
}

type PaidOrderDoc = {
  items?: OrderItem[]
}

function relatedId(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null
  return typeof value === 'string' ? value : value.id
}

async function paidOrderSpots(
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
  itemType: 'trip' | 'program' | 'destination',
  itemId: string,
): Promise<number> {
  const { docs } = await payload.find({
    collection: 'orders',
    where: { status: { equals: 'paid' } },
    limit: 0,
    pagination: false,
    depth: 0,
  })

  return (docs as PaidOrderDoc[]).reduce((total, order) => total + (order.items ?? []).reduce((itemTotal, item) => {
    if (item.itemType !== itemType || relatedId(item[itemType]) !== itemId) return itemTotal
    return itemTotal + (item.quantity ?? item.participantCount ?? 1)
  }, 0), 0)
}

async function syncSpots(
  tripId: string | null,
  programId: string | null,
  destinationId: string | null,
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
) {
  if (tripId) {
    const { docs } = await payload.find({
      collection: 'registrations',
      where: { and: [{ trip: { equals: tripId } }, { status: { in: ['pending', 'confirmed', 'paid'] } }] },
      limit: 0,
      pagination: false,
    })
    const registrationSpots = docs.reduce((s, r) => s + ((r as RegistrationDoc).participantCount ?? 1), 0)
    const used = registrationSpots + await paidOrderSpots(payload, 'trip', tripId)
    const trip = await payload.findByID({ collection: 'trips', id: tripId })
    await payload.update({
      collection: 'trips',
      id: tripId,
      data: { spotsAvailable: Math.max(0, ((trip as { spotsTotal?: number }).spotsTotal ?? 0) - used) },
    })
  }

  if (programId) {
    const { docs } = await payload.find({
      collection: 'registrations',
      where: { and: [{ program: { equals: programId } }, { status: { in: ['pending', 'confirmed', 'paid'] } }] },
      limit: 0,
      pagination: false,
    })
    const registrationSpots = docs.reduce((s, r) => s + ((r as RegistrationDoc).participantCount ?? 1), 0)
    const used = registrationSpots + await paidOrderSpots(payload, 'program', programId)
    const program = await payload.findByID({ collection: 'programs', id: programId })
    await payload.update({
      collection: 'programs',
      id: programId,
      data: { spotsAvailable: Math.max(0, ((program as { spotsTotal?: number }).spotsTotal ?? 0) - used) },
    })
  }

  if (destinationId) {
    const { docs } = await payload.find({
      collection: 'registrations',
      where: { and: [{ destination: { equals: destinationId } }, { status: { in: ['pending', 'confirmed', 'paid'] } }] },
      limit: 0,
      pagination: false,
    })
    const registrationSpots = docs.reduce((s, r) => s + ((r as RegistrationDoc).participantCount ?? 1), 0)
    const used = registrationSpots + await paidOrderSpots(payload, 'destination', destinationId)
    const destination = await payload.findByID({ collection: 'destinations', id: destinationId })
    await payload.update({
      collection: 'destinations',
      id: destinationId,
      data: { spotsAvailable: Math.max(0, ((destination as { spotsTotal?: number }).spotsTotal ?? 0) - used) },
    })
  }
}

function toValidId(v: string | null): string | null {
  if (!v) return null
  return Number.isNaN(Number(v)) ? null : v
}

export const syncSpotsAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  const d = doc as RegistrationDoc
  const tripId = toValidId(d.trip ? (typeof d.trip === 'object' ? d.trip.id : d.trip) : null)
  const programId = toValidId(d.program ? (typeof d.program === 'object' ? d.program.id : d.program) : null)
  const destinationId = toValidId(d.destination ? (typeof d.destination === 'object' ? d.destination.id : d.destination) : null)
  try {
    await syncSpots(tripId, programId, destinationId, req.payload)
  } catch {
    // best-effort
  }
  return doc
}

export const syncSpotsAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const d = doc as RegistrationDoc
  const tripId = toValidId(d.trip ? (typeof d.trip === 'object' ? d.trip.id : d.trip) : null)
  const programId = toValidId(d.program ? (typeof d.program === 'object' ? d.program.id : d.program) : null)
  const destinationId = toValidId(d.destination ? (typeof d.destination === 'object' ? d.destination.id : d.destination) : null)
  try {
    await syncSpots(tripId, programId, destinationId, req.payload)
  } catch {
    // best-effort
  }
}
