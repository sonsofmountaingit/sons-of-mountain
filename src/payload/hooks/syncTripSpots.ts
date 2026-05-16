import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type RegistrationDoc = {
  trip?: string | { id: string } | null
  program?: string | { id: string } | null
  participantCount?: number
  status?: string
}

async function syncSpots(tripId: string | null, programId: string | null, payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload']) {
  if (tripId) {
    const { docs } = await payload.find({
      collection: 'registrations',
      where: { and: [{ trip: { equals: tripId } }, { status: { in: ['pending', 'confirmed', 'paid'] } }] },
      limit: 0,
      pagination: false,
    })
    const used = docs.reduce((s, r) => s + ((r as RegistrationDoc).participantCount ?? 1), 0)
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
    const used = docs.reduce((s, r) => s + ((r as RegistrationDoc).participantCount ?? 1), 0)
    const program = await payload.findByID({ collection: 'programs', id: programId })
    await payload.update({
      collection: 'programs',
      id: programId,
      data: { spotsAvailable: Math.max(0, ((program as { spotsTotal?: number }).spotsTotal ?? 0) - used) },
    })
  }
}

export const syncSpotsAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  const d = doc as RegistrationDoc
  const tripId = d.trip ? (typeof d.trip === 'object' ? d.trip.id : d.trip) : null
  const programId = d.program ? (typeof d.program === 'object' ? d.program.id : d.program) : null
  try {
    await syncSpots(tripId, programId, req.payload)
  } catch {
    // best-effort
  }
  return doc
}

export const syncSpotsAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const d = doc as RegistrationDoc
  const tripId = d.trip ? (typeof d.trip === 'object' ? d.trip.id : d.trip) : null
  const programId = d.program ? (typeof d.program === 'object' ? d.program.id : d.program) : null
  try {
    await syncSpots(tripId, programId, req.payload)
  } catch {
    // best-effort
  }
}
