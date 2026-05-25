import { getPayload } from 'payload'
import config from '@payload-config'
import { DestinationCard } from '@/components/ui/DestinationCard'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Дестинации' }

const getDestinations = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'destinations',
      limit: 50,
      sort: 'name',
      overrideAccess: true,
    })
    return docs
  },
  ['destinations-list'],
  { tags: ['destinations'], revalidate: 3600 },
)

async function DestinationsContent() {
  let destinations: any[] = []
  try {
    destinations = await getDestinations()
  } catch {}

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            name={dest.name}
            slug={dest.slug}
            heroImage={dest.heroImage as { url?: string | null; alt: string } | null}
          />
        ))}
      </div>
      {destinations.length === 0 && (
        <p className="text-white/30 text-center py-20">Скоро ще добавим дестинации.</p>
      )}
    </>
  )
}

export default function DestinationsPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Дестинации</h1>
        <p className="text-white/50 mb-12 text-lg">Избери своето следващо приключение</p>
        <Suspense>
          <DestinationsContent />
        </Suspense>
      </div>
    </div>
  )
}
