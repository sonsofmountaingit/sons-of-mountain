import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { TripCard } from '@/components/ui/TripCard'
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'destinations', limit: 100 })
    if (docs.length > 0) return docs.map((d) => ({ slug: d.slug }))
  } catch {}
  return [{ slug: '_placeholder' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  'use cache'
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const dest = docs[0]
  if (!dest) return { title: 'Дестинация' }
  return {
    title: dest.name,
    description: dest.introText,
  }
}

export default async function DestinationPage({ params }: Props) {
  'use cache'
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const destination = docs[0]
  if (!destination) notFound()

  const { docs: trips } = await payload.find({
    collection: 'trips',
    where: {
      and: [
        { destination: { equals: destination.id } },
        { status: { not_equals: 'draft' } },
      ],
    },
    sort: 'startDate',
    limit: 20,
  })

  const heroImage = destination.heroImage as { url?: string | null; alt: string } | null

  return (
    <article>
      <div className="relative h-screen">
        {heroImage?.url && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{destination.name}</h1>
          <p className="text-lg text-white/70 max-w-2xl">{destination.introText}</p>
        </div>
      </div>

      {Array.isArray(destination.gallery) && destination.gallery.length > 0 && (
        <div className="py-10 overflow-hidden">
          <div className="flex gap-3 px-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {(destination.gallery as { image: { url?: string | null; alt: string } | null }[]).map((item, i) =>
              item.image?.url ? (
                <div key={i} className="relative flex-shrink-0 w-48 aspect-[3/4] rounded-lg overflow-hidden">
                  <Image src={item.image.url} alt={item.image.alt} fill className="object-cover" sizes="192px" />
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {destination.fitnessRatings && (
        <div className="py-16 px-6 border-y border-white/10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">За теб ли е?</h2>
            {[
              { label: 'Трудност', value: destination.fitnessRatings.difficulty },
              { label: 'Комфорт', value: destination.fitnessRatings.comfort },
              { label: 'Природа', value: destination.fitnessRatings.nature },
              { label: 'Култура', value: destination.fitnessRatings.culture },
            ].map(({ label, value }) => (
              <div key={label} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white/70">{label}</span>
                  <span className="text-sm text-white/40">{value}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${value ?? 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trips.length > 0 && (
        <div className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Предстоящи пътувания</h2>
            <div className="space-y-4 mb-10">
              {trips.map((trip) => (
                <BookingFormWrapper
                  key={trip.id}
                  trip={trip as Parameters<typeof BookingFormWrapper>[0]['trip']}
                />
              ))}
            </div>
            <div className="border border-white/10 rounded-lg p-5 text-sm text-white/50">
              <p className="font-medium text-white mb-3">Как работи процесът?</p>
              <ol className="space-y-2">
                <li>1. Попълни формата за записване</li>
                <li>2. Ние те се обаждаме за потвърждение</li>
                <li>3. Договори и данни</li>
                <li>4. Плащане на депозит</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {Array.isArray(destination.itinerary) && destination.itinerary.length > 0 && (
        <div className="py-16 px-6 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-10">Програма</h2>
            <div className="space-y-8">
              {(destination.itinerary as { day: number; title: string }[]).map((day) => (
                <div key={day.day} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                    {day.day}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-semibold mb-2">{day.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
