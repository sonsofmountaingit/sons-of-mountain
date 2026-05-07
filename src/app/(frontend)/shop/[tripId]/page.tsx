import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper'

interface Props { params: Promise<{ tripId: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'trips', limit: 200 })
    if (docs.length > 0) return docs.map((t) => ({ tripId: String(t.id) }))
  } catch {}
  return [{ tripId: '_placeholder' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Запиши се' }
}

async function getTrip(tripId: string) {
  'use cache'
  const payload = await getPayload({ config })
  try {
    return await payload.findByID({ collection: 'trips', id: tripId, depth: 2 })
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
