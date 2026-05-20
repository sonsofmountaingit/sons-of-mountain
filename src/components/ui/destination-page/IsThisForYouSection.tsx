import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface TripSummary {
  id: string
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  price: number
  currency: string
}

interface FitnessRatings {
  difficulty?: number | null
  comfort?: number | null
  nature?: number | null
  culture?: number | null
}

interface Props {
  fitnessRatings?: FitnessRatings | null
  summaryHeading?: string | null
  summaryText?: Record<string, unknown> | null
  upcomingTrips?: TripSummary[]
  thumbnailImage?: string | null
  thumbnailImageAlt?: string
}

function toScale(v: number | null | undefined): number {
  return Math.round((v ?? 50) / 20)
}

function Gauge({ label, value }: { label: string; value: number }) {
  const r = 24
  const circ = 2 * Math.PI * r
  const pct = value / 5
  const dash = circ * pct
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
        <svg width="100%" height="100%" viewBox="0 0 64 64" className="-rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke="#4ade80" strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-lg font-bold text-black">
          {value}
        </span>
      </div>
      <span className="text-[9px] sm:text-xs font-semibold tracking-wide text-black/60 uppercase text-center leading-tight">{label}</span>
    </div>
  )
}

export function IsThisForYouSection({ fitnessRatings, summaryHeading, summaryText, upcomingTrips = [], thumbnailImage, thumbnailImageAlt }: Props) {
  if (!fitnessRatings && !summaryHeading && !summaryText) return null

  const nextTrip = upcomingTrips[0]
  const fillPct = nextTrip ? Math.round(((nextTrip.spotsTotal - nextTrip.spotsAvailable) / nextTrip.spotsTotal) * 100) : 0

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <section className="py-16 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start" data-animate="scale-in">
        <div data-animate="fade-up">
          <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-6">
            ЗА ТЕБ ЛИ Е ТОВА ПЪТУВАНЕ?
          </p>
          {fitnessRatings && (
            <div className="grid grid-cols-4 gap-3 mb-8">
              <Gauge label="ТРУДНОСТ" value={toScale(fitnessRatings.difficulty)} />
              <Gauge label="КОМФОРТ" value={toScale(fitnessRatings.comfort)} />
              <Gauge label="ПРИРОДА" value={toScale(fitnessRatings.nature)} />
              <Gauge label="КУЛТУРА" value={toScale(fitnessRatings.culture)} />
            </div>
          )}
          {summaryHeading && (
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{summaryHeading}</h2>
          )}
          {summaryText && (
            <div className="prose text-black/70 max-w-none text-sm leading-relaxed">
              <RichText data={summaryText as unknown as Parameters<typeof RichText>[0]["data"]} />
            </div>
          )}
        </div>

        {(thumbnailImage || nextTrip) && (
          <div className="bg-black rounded-2xl overflow-hidden">
            {thumbnailImage && (
              <div className="relative aspect-[4/3]">
                <Image
                  src={thumbnailImage}
                  alt={thumbnailImageAlt ?? 'Пътуване'}
                  fill
                  loading="lazy"
                  quality={80}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            )}
            {nextTrip && (
              <div className="p-5">
                <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-3">
                  ПРЕДСТОЯЩИ ПЪТУВАНИЯ
                </p>
                <p className="text-white font-semibold mb-3">
                  📅 {formatDate(nextTrip.startDate)} – {formatDate(nextTrip.endDate)}
                </p>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
