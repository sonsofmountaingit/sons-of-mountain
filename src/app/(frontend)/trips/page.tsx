import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Пътувания — Sons of Mountains' }

const getTrips = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'trips',
      where: { status: { not_equals: 'draft' } },
      sort: 'startDate',
      limit: 100,
      depth: 1,
      overrideAccess: true,
    })
    return docs
  },
  ['trips-list'],
  { tags: ['trips'], revalidate: 3600 },
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
  const isEarlyBird = earlyBirdPrice && earlyBirdUntil && new Date(earlyBirdUntil) > new Date()
  const tags = trip.tags as { tag: string }[] | null

  return (
    <Link href={href} className="group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={heroImage?.alt ?? trip.title as string}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <div className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">
            EARLY BIRD
          </div>
        )}
        {spotsAvailable !== null && spotsAvailable <= 5 && status === 'active' && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {spotsAvailable} места
          </div>
        )}
      </div>
      <div className="p-5">
        {dest && (
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">
            {dest.name as string}
          </p>
        )}
        <h3 className="text-white font-bold text-lg leading-tight mb-2">{trip.title as string}</h3>
        {startDate && endDate && (
          <p className="text-white/50 text-sm mb-3">
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
        {price !== null && (
          <div className="flex items-end gap-2">
            {isEarlyBird && (
              <span className="text-amber-400 font-bold text-xl">
                {earlyBirdPrice} {currency}
              </span>
            )}
            <span className={`font-bold text-xl ${isEarlyBird ? 'text-white/30 line-through text-base' : 'text-white'}`}>
              {price} {currency}
            </span>
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

  return (
    <>
      {active.length === 0 && soldOut.length === 0 && (
        <p className="text-white/30 text-center py-20">Скоро ще добавим пътувания.</p>
      )}
      {active.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {active.map((trip) => (
            <TripCard key={trip.id as string} trip={trip} />
          ))}
        </div>
      )}
      {soldOut.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-white/30 mb-6 mt-4">Разпродадени</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {soldOut.map((trip) => (
              <TripCard key={trip.id as string} trip={trip} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default function TripsPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Пътувания</h1>
        <p className="text-white/50 mb-12 text-lg">Групови пътувания с организиран транспорт и настаняване</p>
        <Suspense fallback={null}>
          <TripsContent />
        </Suspense>
      </div>
    </div>
  )
}
