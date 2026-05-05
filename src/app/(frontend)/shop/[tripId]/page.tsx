import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper'

interface Props { params: Promise<{ tripId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Запиши се' }
}

export default async function ShopTripPage({ params }: Props) {
  const { tripId } = await params
  const payload = await getPayload({ config })

  const trip = await payload.findByID({ collection: 'trips', id: tripId, depth: 2 })
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
