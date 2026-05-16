import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'

interface Props { params: Promise<{ tripId: string }> }

let _staticParamsCache: Promise<{ tripId: string }[]> | null = null
export async function generateStaticParams() {
  if (!_staticParamsCache) {
    _staticParamsCache = (async () => {
      try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({ collection: 'trips', limit: 200, select: { id: true } })
        if (docs.length > 0) return docs.map((t) => ({ tripId: String(t.id) }))
      } catch {}
      return [{ tripId: '_placeholder' }]
    })()
  }
  return _staticParamsCache
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Запиши се' }
}

async function getTrip(tripId: string) {
  'use cache'
  cacheTag('trips')
  cacheLife('days')
  const payload = await getPayload({ config })
  try {
    return await payload.findByID({ collection: 'trips', id: tripId, depth: 1 })
  } catch {
    return null
  }
}

export default async function ShopTripPage({ params }: Props) {
  const { tripId } = await params
  const trip = await getTrip(tripId)
  if (!trip) notFound()
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Запиши се</h1>
        <BookingFormWrapper trip={trip as Parameters<typeof BookingFormWrapper>[0]['trip']} />
      </div>
    </div>
  )
}
