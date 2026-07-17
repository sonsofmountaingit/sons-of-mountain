import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'
import { buildStaticMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/trips', {
    title: 'Пътувания — Sons of Mountains',
    description: 'Всички организирани групови пътувания. Планини, острови, джунгли — открий следващото си приключение с Sons of Mountains.',
  })
}

const getTrips = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'trips',
      where: { and: [{ status: { not_equals: 'draft' } }, { status: { not_equals: 'archived' } }] },
      sort: 'startDate',
      limit: 100,
      depth: 1,
      overrideAccess: true,
    })
    return docs
  },
  ['trips-list'],
  { tags: ['trips'], revalidate: false },
)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TripCard({ trip }: { trip: Record<string, unknown> }) {
  const dest = trip.destination as Record<string, unknown> | null
  const heroImage = (trip.heroImage ?? dest?.heroImage) as { url?: string | null; alt?: string } | null
  const imageUrl = mediaUrl(heroImage?.url)
  const slug = trip.slug as string | null
  const href = slug ? `/trips/${slug}` : `/trips/${trip.id}`
  const startDate = trip.startDate as string | null
  const endDate = trip.endDate as string | null
  const price = trip.price as number | null
  const currency = (trip.currency ?? 'EUR') as string
  const spotsAvailable = trip.spotsAvailable as number | null
  const status = trip.status as string
  const earlyBirdPrice = trip.earlyBirdPrice as number | null
  const earlyBirdUntil = trip.earlyBirdUntil as string | null
  const earlyBirdSpots = trip.earlyBirdSpots as number | null
  const isEarlyBird = earlyBirdPrice && earlyBirdUntil && new Date(earlyBirdUntil) > new Date()
  const earlyBirdSpotsLeft = isEarlyBird && earlyBirdSpots != null && spotsAvailable != null
    ? Math.min(spotsAvailable, earlyBirdSpots)
    : null
  const tags = trip.tags as { tag: string }[] | null

  return (
    <Link href={href} className="group block bg-white/5 hover:bg-white/10 transition-colors rounded-lg sm:rounded-2xl overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={heroImage?.alt ?? trip.title as string}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
        {status === 'soldOut' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest">РАЗПРОДАДЕНО</span>
          </div>
        )}
        {isEarlyBird && status === 'active' && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">EARLY BIRD</span>
            {earlyBirdSpotsLeft != null && (
              <span className="bg-black/70 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded">
                {earlyBirdSpotsLeft} {earlyBirdSpotsLeft === 1 ? 'място' : 'места'}
              </span>
            )}
          </div>
        )}
        {spotsAvailable !== null && spotsAvailable <= 5 && status === 'active' && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {spotsAvailable} места
          </div>
        )}
      </div>
      <div className="p-3 sm:p-5">
        {dest && (
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">
            {dest.name as string}
          </p>
        )}
        <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-2">{trip.title as string}</h3>
        {startDate && endDate && (
          <p className="text-white/50 text-xs sm:text-sm mb-3">
            {formatDate(startDate)} – {formatDate(endDate)}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((t, i) => (
              <span key={i} className="text-white/40 text-xs border border-white/20 px-2 py-0.5 rounded-full">
                {t.tag}
              </span>
            ))}
          </div>
        )}
        {(isEarlyBird || price !== null) && (
          <div className="flex items-end gap-2">
            {isEarlyBird && (
              <span className="text-amber-400 font-bold text-xl">
                {earlyBirdPrice} {currency}
              </span>
            )}
            {price !== null && (
              <span className={`font-bold text-xl ${isEarlyBird ? 'text-white/30 line-through text-base' : 'text-white'}`}>
                {price} {currency}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

async function TripsContent() {
  let trips: Record<string, unknown>[] = []
  try {
    trips = (await getTrips()) as unknown as Record<string, unknown>[]
  } catch {}

  const active = trips.filter(t => t.status !== 'soldOut')
  const soldOut = trips.filter(t => t.status === 'soldOut')

  let archived: Record<string, unknown>[] = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'trips',
      where: { status: { equals: 'archived' } },
      sort: '-startDate',
      limit: 100,
      depth: 1,
      overrideAccess: true,
    })
    archived = docs as unknown as Record<string, unknown>[]
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Пътувания — Sons of Mountains',
    url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/trips`,
    itemListElement: (trips as any[]).slice(0, 30).map((t: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Event', name: t.title, url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/trips/${t.slug}` },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {active.length === 0 && soldOut.length === 0 && (
        <p className="text-white/30 text-center py-20">Скоро ще добавим пътувания.</p>
      )}
      {active.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {active.map((trip) => (
            <TripCard key={trip.id as string} trip={trip} />
          ))}
        </div>
      )}
      {soldOut.length > 0 && (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-white/30 mb-4 sm:mb-6 mt-4">Разпродадени</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 opacity-60">
            {soldOut.map((trip) => (
              <TripCard key={trip.id as string} trip={trip} />
            ))}
          </div>
        </>
      )}
      {archived.length > 0 && (
        <details className="mt-12 sm:mt-16 group">
          <summary className="cursor-pointer text-white/40 hover:text-white/70 transition-colors text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6 sm:mb-8 list-none flex items-center gap-2">
            <span className="border border-white/20 rounded px-3 py-1.5 group-open:border-white/40">
              Виж предходни пътувания ({archived.length})
            </span>
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 opacity-60">
            {archived.map((trip) => (
              <TripCard key={trip.id as string} trip={trip} />
            ))}
          </div>
        </details>
      )}
    </>
  )
}

export default function TripsPage() {
  return (
    <div className="pt-16 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4">Пътувания</h1>
        <p className="text-white/50 mb-8 sm:mb-12 text-base sm:text-lg">Групови пътувания с организиран транспорт и настаняване</p>
        <Suspense fallback={null}>
          <TripsContent />
        </Suspense>
      </div>
    </div>
  )
}
