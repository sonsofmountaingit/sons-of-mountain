import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ItineraryNav, ItineraryAccordion } from './ItinerarySectionClient'
import { mediaUrl } from '@/lib/media-url'

interface DayStats {
  ascent?: string | null
  descent?: string | null
  distance?: string | null
  duration?: string | null
  accommodation?: string | null
  meals?: string | null
}

export interface ItineraryDay {
  day: number
  title: string
  content?: Record<string, unknown> | null
  image?: { url?: string | null; alt?: string } | null
  stats?: DayStats | null
}

interface Props {
  itinerary: ItineraryDay[]
}

const STAT_ITEMS = [
  { key: 'ascent' as const, label: 'ИЗКАЧВАНЕ', icon: '/icons/ascent.svg' },
  { key: 'descent' as const, label: 'СПУСКАНЕ', icon: '/icons/descent.svg' },
  { key: 'distance' as const, label: 'РАЗСТОЯНИЕ', icon: '/icons/distance.svg' },
  { key: 'duration' as const, label: 'ВРЕМЕ', icon: '/icons/duration.svg' },
  { key: 'accommodation' as const, label: 'НАСТАНЯВАНЕ', icon: '/icons/accommodation.svg' },
  { key: 'meals' as const, label: 'ВКЛЮЧЕНО ИЗХРАНВАНЕ', icon: '/icons/meals.svg' },
]

export function DayStatsBar({ stats }: { stats: DayStats }) {
  const visible = STAT_ITEMS.filter(({ key }) => stats[key])
  if (!visible.length) return null
  return (
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 rounded bg-gray-50 border border-black/8 px-4 py-3 w-full">
      {visible.map(({ key, label, icon }) => (
        <div key={key} className="flex items-center gap-1.5">
          <img src={icon} alt="" className="w-3.5 h-3.5 flex-shrink-0 object-contain" />
          <span className="text-[9px] text-black/50 uppercase tracking-wide leading-none">{label}:</span>
          <span className="text-[9px] font-semibold text-black leading-none">{stats[key]}</span>
        </div>
      ))}
    </div>
  )
}

export function DayContentBlock({ day }: { day: ItineraryDay }) {
  return (
    <>
      {day.content && (
        <div className="prose text-black/70 max-w-none text-sm leading-relaxed">
          <RichText data={day.content as unknown as Parameters<typeof RichText>[0]["data"]} />
        </div>
      )}
      {day.stats && <DayStatsBar stats={day.stats} />}
    </>
  )
}

export function ItinerarySection({ itinerary }: Props) {
  if (!itinerary?.length) return null
  const days = itinerary.map((d) => d.day)

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto">

        {/* Mobile accordion */}
        <div className="md:hidden">
          <h2 className="text-4xl font-bold mb-8">Програма</h2>
          <ItineraryAccordion itinerary={itinerary} />
          <p className="text-[11px] text-black/40 mt-6 leading-relaxed">
            * Sons of Mountains запазва правото си да адаптира и промени програмата според промени в условията, климата и други фактори.
          </p>
        </div>

        {/* Desktop 3-col */}
        <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-8 items-start">
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
                <DayContentBlock day={day} />
                {i < itinerary.length - 1 && <hr className="mt-8 border-black/10" />}
              </div>
            ))}
          </div>

          <ItineraryNav days={days} />
        </div>

      </div>
    </section>
  )
}
