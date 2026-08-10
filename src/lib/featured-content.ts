import type { BasePayload } from 'payload'

const siteUrl = () => process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'

function mapTrip(trip: any) {
  return {
    title: trip.title,
    startDate: trip.startDate,
    endDate: trip.endDate,
    location: trip.location,
    price: trip.price,
    currency: trip.currency,
    spotsAvailable: trip.spotsAvailable,
    heroImageUrl: trip.heroImage?.url,
    slug: trip.slug,
    url: `${siteUrl()}/trips/${trip.slug}`,
    status: trip.status,
    navSection: trip.navSection,
  }
}

function mapProgram(program: any) {
  return {
    title: program.title,
    type: program.type,
    startDate: program.startDate,
    endDate: program.endDate,
    location: program.location,
    price: program.price,
    heroImageUrl: program.heroImage?.url,
    slug: program.slug,
    url: `${siteUrl()}/programs/${program.slug}`,
  }
}

function mapDestination(destination: any) {
  return {
    title: destination.title ?? destination.name,
    slug: destination.slug,
    heroImageUrl: destination.heroImage?.url,
    description: destination.description,
    url: `${siteUrl()}/destinations/${destination.slug}`,
    tripCount: destination.tripCount,
  }
}

async function resolveIds(payload: BasePayload, collection: 'trips' | 'programs' | 'destinations', ids: (string | { id: string })[]): Promise<any[]> {
  if (!ids?.length) return []
  const docs = await Promise.all(
    ids.map((ref) => {
      const id = typeof ref === 'string' ? ref : ref.id
      return payload.findByID({ collection, id, depth: 1 }).catch(() => null)
    }),
  )
  return docs.filter(Boolean)
}

export async function buildFeaturedContext(
  payload: BasePayload,
  selection: {
    featuredTrips?: (string | { id: string })[] | null
    featuredPrograms?: (string | { id: string })[] | null
    featuredDestinations?: (string | { id: string })[] | null
  },
): Promise<Record<string, string>> {
  const [trips, programs, destinations] = await Promise.all([
    resolveIds(payload, 'trips', selection.featuredTrips ?? []),
    resolveIds(payload, 'programs', selection.featuredPrograms ?? []),
    resolveIds(payload, 'destinations', selection.featuredDestinations ?? []),
  ])

  return {
    featuredTrips: JSON.stringify(trips.map(mapTrip)),
    featuredPrograms: JSON.stringify(programs.map(mapProgram)),
    featuredDestinations: JSON.stringify(destinations.map(mapDestination)),
  }
}

// Waitlist/StockAlerts entries store the bookable item as a polymorphic relationship
// (trip/program/destination/product) rather than a stored title field — resolve it live.
export function waitlistItemTitle(entry: any): string {
  const itemType = entry?.itemType
  const item = itemType ? entry[itemType] : null
  if (!item || typeof item !== 'object') return ''
  return itemType === 'destination' ? (item.name ?? '') : (item.title ?? '')
}

export async function buildAutoContext(payload: BasePayload): Promise<Record<string, string>> {
  const now = new Date().toISOString()

  const [upcomingTrips, upcomingPrograms, soldOutTrips, popularTrips] = await Promise.all([
    payload.find({ collection: 'trips', where: { and: [{ status: { equals: 'active' } }, { startDate: { greater_than_equal: now } }] }, sort: 'startDate', limit: 3 }),
    payload.find({ collection: 'programs', where: { and: [{ status: { equals: 'active' } }, { startDate: { greater_than_equal: now } }] }, sort: 'startDate', limit: 3 }),
    payload.find({ collection: 'trips', where: { status: { equals: 'soldOut' } }, limit: 10 }),
    payload.find({ collection: 'trips', sort: '-viewCount', limit: 3 }),
  ])

  return {
    upcomingTrips: JSON.stringify((upcomingTrips.docs as any[]).map(mapTrip)),
    upcomingPrograms: JSON.stringify((upcomingPrograms.docs as any[]).map(mapProgram)),
    soldOutTrips: JSON.stringify((soldOutTrips.docs as any[]).map(mapTrip)),
    popularTrips: JSON.stringify((popularTrips.docs as any[]).map(mapTrip)),
  }
}
