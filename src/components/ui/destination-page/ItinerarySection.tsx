import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ItineraryNav } from './ItinerarySectionClient'
import { mediaUrl } from '@/lib/media-url'

interface ItineraryDay {
  day: number
  title: string
  content?: Record<string, unknown> | null
  image?: { url?: string | null; alt?: string } | null
}

interface Props {
  itinerary: ItineraryDay[]
}

export function ItinerarySection({ itinerary }: Props) {
  if (!itinerary?.length) return null
  const days = itinerary.map((d) => d.day)

  return (
    <section className="py-16 px-6 bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-[auto_1fr_auto] gap-8 items-start">
        <div className="flex flex-col gap-3">
          {itinerary.map((day) =>
            mediaUrl(day.image?.url) ? (
              <div key={day.day} className="relative w-40 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={mediaUrl(day.image!.url)!}
                  alt={day.image?.alt ?? day.title}
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            ) : (
              <div key={day.day} className="w-40 aspect-square rounded-lg bg-gray-200 flex-shrink-0" />
            )
          )}
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-10" data-animate="fade-up">Програма</h2>
          {itinerary.map((day, i) => (
            <div key={day.day} id={`day-${day.day}`} data-day={day.day} className="mb-10 scroll-mt-24" data-animate="fade-up">
              <p className="text-xs font-bold tracking-widest uppercase border-b border-black/20 pb-1 mb-3 inline-block">
                ДЕН {day.day}
              </p>
              <h3 className="text-xl font-bold mb-3">{day.title}</h3>
              {day.content && (
                <div className="prose text-black/70 max-w-none text-sm leading-relaxed">
                  <RichText data={day.content as unknown as Parameters<typeof RichText>[0]["data"]} />
                </div>
              )}
              {i < itinerary.length - 1 && <hr className="mt-8 border-black/10" />}
            </div>
          ))}
        </div>

        <ItineraryNav days={days} />
      </div>
    </section>
  )
}
