'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ItineraryNav, ItineraryAccordion } from './ItinerarySectionClient'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

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
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 pt-5 border-t border-black/6">
      {visible.map(({ key, label, icon }) => (
        <div key={key} className="flex items-center gap-2">
          <img src={icon} alt="" className="w-3.5 h-3.5 opacity-25 flex-shrink-0" />
          <span className="text-[10px] text-black/35 uppercase tracking-widest">{label}</span>
          <span className="text-[11px] font-bold text-black/80">{stats[key]}</span>
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
  const imagesColRef = useRef<HTMLDivElement>(null)
  const contentColRef = useRef<HTMLDivElement>(null)
  const navColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      if (imagesColRef.current) {
        gsap.from(imagesColRef.current, { opacity: 0, x: -60, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: imagesColRef.current, start: 'top 85%', once: true } })
      }
      if (contentColRef.current) {
        const header = contentColRef.current.querySelector('.itinerary-header')
        const rows = contentColRef.current.querySelectorAll('.itinerary-row')
        if (header) gsap.from(header, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: header, start: 'top 85%', once: true } })
        rows.forEach((row) => {
          gsap.from(row, { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 88%', once: true } })
        })
      }
      if (navColRef.current) {
        gsap.from(navColRef.current, { opacity: 0, x: 30, duration: 0.8, ease: 'power3.out', delay: 0.3, scrollTrigger: { trigger: navColRef.current, start: 'top 85%', once: true } })
      }
    })
    return () => ctx.revert()
  }, [itinerary])

  if (!itinerary?.length) return null
  const days = itinerary.map((d) => d.day)

  return (
    <section className="w-full bg-white text-black overflow-hidden">

      {/* Mobile */}
      <div className="md:hidden px-5 py-14">
        <p className="text-[10px] font-bold tracking-[0.25em] text-black/30 uppercase mb-1">Детайлна</p>
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Програма</h2>
        <ItineraryAccordion itinerary={itinerary} />
        <p className="text-[10px] text-black/25 mt-10 leading-relaxed">
          * Sons of Mountains запазва правото си да адаптира и промени програмата според промени в условията, климата и други фактори.
        </p>
      </div>

      {/* Desktop: images | content | day nav */}
      <div className="hidden md:flex w-full">

        {/* Col 1 — images, full height of section */}
        <div ref={imagesColRef} className="w-[300px] flex-shrink-0 flex flex-col">
          {itinerary.map((day) =>
            mediaUrl(day.image?.url) ? (
              <div key={day.day} className="relative flex-1" style={{ minHeight: '260px' }}>
                <Image
                  src={mediaUrl(day.image!.url)!}
                  alt={day.image?.alt ?? day.title}
                  fill
                  loading="lazy"
                  quality={80}
                  className="object-cover"
                  sizes="300px"
                />
                {/* subtle day label overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">ДЕН {day.day}</span>
                </div>
              </div>
            ) : (
              <div key={day.day} className="relative flex-1 bg-stone-100" style={{ minHeight: '260px' }}>
                <div className="absolute bottom-0 left-0 right-0 px-5 py-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-black/25 uppercase">ДЕН {day.day}</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Col 2 — day entries, full width */}
        <div ref={contentColRef} className="flex-1 min-w-0 border-x border-black/8">
          {/* Header */}
          <div className="itinerary-header px-12 pt-16 pb-10 border-b border-black/8">
            <p className="text-[10px] font-bold tracking-[0.25em] text-black/30 uppercase mb-2">Детайлна</p>
            <h2 className="text-5xl font-bold tracking-tight leading-none">Програма</h2>
          </div>

          {/* Day rows */}
          {itinerary.map((day, i) => (
            <div
              key={day.day}
              id={`day-${day.day}`}
              data-day={day.day}
              className={`itinerary-row px-12 py-10 scroll-mt-0 ${i < itinerary.length - 1 ? 'border-b border-black/8' : ''}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold tracking-[0.25em] text-black/25 uppercase">ДЕН {day.day}</span>
                <span className="h-px flex-1 bg-black/6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 leading-tight">{day.title}</h3>
              {day.content && (
                <div className="prose max-w-none text-black/55 text-[13.5px] leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
                  <RichText data={day.content as unknown as Parameters<typeof RichText>[0]["data"]} />
                </div>
              )}
              {day.stats && <DayStatsBar stats={day.stats} />}
            </div>
          ))}

          <div className="px-12 py-8 border-t border-black/8">
            <p className="text-[10px] text-black/20 leading-relaxed max-w-lg">
              * Sons of Mountains запазва правото си да адаптира и промени програмата според промени в условията, климата и други фактори.
            </p>
          </div>
        </div>

        {/* Col 3 — sticky day nav */}
        <div ref={navColRef} className="w-[72px] flex-shrink-0 sticky top-0 self-start h-screen flex flex-col items-center justify-center">
          <ItineraryNav days={days} />
        </div>

      </div>
    </section>
  )
}
