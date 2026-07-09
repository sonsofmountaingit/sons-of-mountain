import { getPayload } from 'payload'
import config from '@payload-config'
import { DestinationCard } from '@/components/ui/DestinationCard'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import { buildMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = buildMetadata({
  title: 'Дестинации — Sons of Mountains',
  description: 'Открий всички наши дестинации — от Балканите до Хималаите, от Средиземно море до Индонезия. Приключения за всеки вкус.',
  slug: 'destinations',
})

const getDestinations = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'destinations',
      where: { bookingStatus: { not_equals: 'archived' } },
      limit: 200,
      sort: 'startDate',
      overrideAccess: true,
    })
    return docs
  },
  ['destinations-list'],
  { tags: ['destinations'], revalidate: false },
)

const getTrips = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'trips',
      where: { status: { not_equals: 'archived' } },
      limit: 200,
      sort: 'startDate',
      overrideAccess: true,
    })
    return docs
  },
  ['destinations-all-trips'],
  { tags: ['trips'], revalidate: false },
)

const DESTINATION_TYPE_LABELS: Record<string, string> = {
  bulgaria: 'В България',
  abroad: 'В чужбина',
}

const TRIP_NAV_SECTION_LABELS: Record<string, string> = {
  bulgaria: 'В България',
  abroad: 'В чужбина',
  individual: 'Индивидуална програма',
}

async function DestinationsContent({ type }: { type?: string }) {
  let destinations: any[] = []
  let trips: any[] = []
  try {
    destinations = await getDestinations()
  } catch {}
  try {
    trips = await getTrips()
  } catch {}

  if (type === 'bulgaria' || type === 'abroad') {
    destinations = destinations.filter((d: any) => d.type === type)
    trips = trips.filter((t: any) => t.navSection === type)
  } else if (type === 'trips') {
    destinations = []
    trips = trips.filter((t: any) => t.navSection === 'individual')
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Дестинации — Sons of Mountains',
    url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/destinations`,
    itemListElement: [
      ...(destinations as any[]).map((d: any) => ({
        name: d.name,
        url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/destinations/${d.slug}`,
      })),
      ...(trips as any[]).map((t: any) => ({
        name: t.title,
        url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/trips/${t.slug}`,
      })),
    ].slice(0, 50).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Place', name: entry.name, url: entry.url },
    })),
  }

  let archived: any[] = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'destinations',
      where: { bookingStatus: { equals: 'archived' } },
      sort: '-startDate',
      limit: 100,
      overrideAccess: true,
    })
    archived = docs
  } catch {}

  if (type === 'bulgaria' || type === 'abroad') {
    archived = archived.filter((d: any) => d.type === type)
  } else if (type === 'trips') {
    archived = []
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {destinations.length === 0 && trips.length === 0 && archived.length === 0 && (
        <p className="text-white/30 text-center py-20">Скоро ще добавим дестинации.</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((dest: any) => (
          <DestinationCard
            key={dest.id}
            name={dest.name}
            slug={dest.slug}
            heroImage={dest.heroImage as { url?: string | null; alt: string } | null}
            spotsAvailable={dest.spotsAvailable ?? undefined}
            earlyBirdPrice={dest.earlyBirdPrice ?? null}
            earlyBirdUntil={dest.earlyBirdUntil ?? null}
            earlyBirdSpots={dest.earlyBirdSpots ?? null}
            label={DESTINATION_TYPE_LABELS[dest.type] ?? undefined}
          />
        ))}
        {trips.map((trip: any) => (
          <DestinationCard
            key={trip.id}
            name={trip.title}
            slug={trip.slug}
            href={`/trips/${trip.slug}`}
            heroImage={trip.heroImage as { url?: string | null; alt: string } | null}
            spotsAvailable={trip.spotsAvailable ?? undefined}
            earlyBirdPrice={trip.earlyBirdPrice ?? null}
            earlyBirdUntil={trip.earlyBirdUntil ?? null}
            earlyBirdSpots={trip.earlyBirdSpots ?? null}
            label={TRIP_NAV_SECTION_LABELS[trip.navSection] ?? undefined}
          />
        ))}
      </div>
      {archived.length > 0 && (
        <details className="mt-16 group">
          <summary className="cursor-pointer text-white/40 hover:text-white/70 transition-colors text-sm font-semibold uppercase tracking-widest mb-8 list-none flex items-center gap-2">
            <span className="border border-white/20 rounded px-3 py-1.5 group-open:border-white/40">
              Виж предходни дестинации ({archived.length})
            </span>
          </summary>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 opacity-60">
            {archived.map((dest: any) => (
              <DestinationCard
                key={dest.id}
                name={dest.name}
                slug={dest.slug}
                heroImage={dest.heroImage as { url?: string | null; alt: string } | null}
                label={DESTINATION_TYPE_LABELS[dest.type] ?? undefined}
              />
            ))}
          </div>
        </details>
      )}
    </>
  )
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Дестинации</h1>
        <p className="text-white/50 mb-12 text-lg">Избери своето следващо приключение</p>
        <Suspense>
          <DestinationsContent type={type} />
        </Suspense>
      </div>
    </div>
  )
}
