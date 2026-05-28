'use client'

import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

function ArcStat({ label, value, index }: { label: string; value: number; index: number }) {
  const max = 5
  const size = 64
  const strokeWidth = 5
  const r = (size - strokeWidth) / 2
  const startAngle = 160
  const totalDeg = 220
  const endAngle = startAngle + totalDeg
  const fillDeg = startAngle + (value / max) * totalDeg

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const cx = size / 2
  const cy = size / 2

  const arcPath = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(toRad(from))
    const y1 = cy + r * Math.sin(toRad(from))
    const x2 = cx + r * Math.cos(toRad(to))
    const y2 = cy + r * Math.sin(toRad(to))
    const large = to - from > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  const arcRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = arcRef.current
    if (!el) return
    const pathLen = el.getTotalLength()
    gsap.set(el, { strokeDasharray: pathLen, strokeDashoffset: pathLen })
    gsap.to(el, {
      strokeDashoffset: 0,
      duration: 1,
      ease: 'power3.out',
      delay: index * 0.15,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  }, [index])

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <path d={arcPath(startAngle, endAngle)} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path ref={arcRef} d={arcPath(startAngle, fillDeg)} fill="none" stroke="#111" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-black leading-none">
          {value}
        </span>
      </div>
      <span className="text-[10px] font-semibold tracking-widest text-black/50 uppercase leading-tight">{label}</span>
    </div>
  )
}

export function IsThisForYouSection({ fitnessRatings, summaryHeading, summaryText, upcomingTrips = [], thumbnailImage, thumbnailImageAlt }: Props) {
  if (!fitnessRatings && !summaryHeading && !summaryText) return null

  const nextTrip = upcomingTrips[0]
  const fillPct = nextTrip ? Math.round(((nextTrip.spotsTotal - nextTrip.spotsAvailable) / nextTrip.spotsTotal) * 100) : 0

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const sectionRef = useRef<HTMLElement>(null)
  const textColRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const statsColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text col fades up
      if (textColRef.current) {
        gsap.from(textColRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: textColRef.current, start: 'top 85%', once: true },
        })
      }

      // Image slides up with slight scale
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          y: 80,
          scale: 0.96,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', once: true },
        })
      }

      // Stats col fades in from right
      if (statsColRef.current) {
        gsap.from(statsColRef.current, {
          opacity: 0,
          x: 40,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: { trigger: statsColRef.current, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-6 sm:gap-8 md:gap-12 items-center">

          {/* Col 1 — heading + text + trip bar */}
          <div ref={textColRef}>
            <p className="text-xs font-semibold tracking-widest text-black/40 uppercase mb-4">
              ЗА ТЕБ ЛИ Е ТОВА ПЪТУВАНЕ?
            </p>
            {summaryHeading && (
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {summaryHeading}
              </h2>
            )}
            {summaryText && (
              <div className="prose text-black/60 max-w-none text-sm leading-relaxed mb-6">
                <RichText data={summaryText as unknown as Parameters<typeof RichText>[0]["data"]} />
              </div>
            )}
            {nextTrip && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-black/40 uppercase mb-2">
                  ПРЕДСТОЯЩИ ПЪТУВАНИЯ
                </p>
                <p className="text-sm font-semibold mb-2">
                  {formatDate(nextTrip.startDate)} – {formatDate(nextTrip.endDate)}
                </p>
                <div className="h-1 bg-black/10 rounded-full overflow-hidden w-48">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Col 2 — large image (hidden on mobile, shown on md+) */}
          {thumbnailImage ? (
            <div ref={imageRef} className="hidden md:block relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={thumbnailImage}
                alt={thumbnailImageAlt ?? 'Пътуване'}
                fill
                loading="lazy"
                quality={85}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : <div className="hidden md:block" />}

          {/* Col 3 — arc gauges */}
          {fitnessRatings && (
            <div ref={statsColRef} className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4 md:min-w-[140px]">
              <ArcStat label="ТРУДНОСТ" value={toScale(fitnessRatings.difficulty)} index={0} />
              <ArcStat label="КОМФОРТ" value={toScale(fitnessRatings.comfort)} index={1} />
              <ArcStat label="ПРИРОДА" value={toScale(fitnessRatings.nature)} index={2} />
              <ArcStat label="КУЛТУРА" value={toScale(fitnessRatings.culture)} index={3} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
