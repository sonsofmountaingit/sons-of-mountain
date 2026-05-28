'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type FeaturedTravelItem = {
  id: string
  kind: 'destination' | 'trip' | 'program'
  title: string
  subtitle: string
  image: string | null
  location: string
  month: string | null
  durationDays: number | null
  price: number | null
  currency: string
  spotsAvailable: number | null
  href: string
}

const KIND_LABEL: Record<string, string> = {
  destination: 'Дестинация',
  trip: 'Пътуване',
  program: 'Програма',
}

const KIND_COLOR: Record<string, string> = {
  destination: 'bg-sky-500/80',
  trip: 'bg-amber-500/80',
  program: 'bg-violet-500/80',
}

function StarRating({ n = 5 }: { n?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={i < n ? 'text-amber-400' : 'text-white/30'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function Card({ item }: { item: FeaturedTravelItem }) {
  const fmtPrice = item.price != null
    ? `${item.currency === 'EUR' ? '€' : item.currency === 'USD' ? '$' : 'лв.'}${item.price.toLocaleString('bg-BG')}`
    : null

  return (
    <Link href={item.href} className="group relative overflow-hidden block h-full w-full">
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800" />
      )}

      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* top: kind badge + spots */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm ${KIND_COLOR[item.kind] ?? 'bg-black/50'}`}>
          {KIND_LABEL[item.kind] ?? item.kind}
        </span>
        {item.spotsAvailable !== null && (
          item.spotsAvailable === 0
            ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/80 text-white backdrop-blur-sm">Няма места</span>
            : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/80 text-white backdrop-blur-sm">{item.spotsAvailable} {item.spotsAvailable === 1 ? 'място' : 'места'}</span>
        )}
      </div>

      {/* bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-5">
        {item.location && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/55 mb-1 flex items-center gap-1">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {item.location}
          </p>
        )}

        <h3 className="text-white font-bold text-sm md:text-base lg:text-lg leading-tight line-clamp-2">
          {item.title}
        </h3>

        <div className="flex items-center justify-between mt-2 gap-2">
          <StarRating />
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {item.month && (
              <span className="text-[10px] text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">{item.month}</span>
            )}
            {item.durationDays && (
              <span className="text-[10px] text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {item.durationDays}д
              </span>
            )}
            {fmtPrice && (
              <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                {fmtPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function distribute(items: FeaturedTravelItem[]): [FeaturedTravelItem[], FeaturedTravelItem[], FeaturedTravelItem[]] {
  const total = items.length
  const perRow = Math.ceil(total / 3)
  const r1 = items.slice(0, perRow)
  const r2 = items.slice(perRow, perRow * 2)
  const r3 = items.slice(perRow * 2)
  return [r1, r2, r3]
}

function Row1({ items }: { items: FeaturedTravelItem[] }) {
  const [main, ...rest] = items
  if (!rest.length) {
    return (
      <div className="h-[56vw] min-h-[220px] md:h-[580px] relative">
        {main && <Card item={main} />}
      </div>
    )
  }
  return (
    <>
      {/* mobile: stack vertically */}
      <div className="flex flex-col gap-1 md:hidden">
        {[main, ...rest.slice(0, 2)].filter(Boolean).map((item) => (
          <div key={item!.id} className="relative h-[56vw] min-h-[200px]">
            <Card item={item!} />
          </div>
        ))}
      </div>
      {/* desktop: original layout */}
      <div className="hidden md:flex gap-1 h-[580px]">
        <div className="flex-[2] relative">
          {main && <Card item={main} />}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {rest.slice(0, 2).map((item) => (
            <div key={item.id} className="flex-1 relative">
              <Card item={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Row2({ items }: { items: FeaturedTravelItem[] }) {
  return (
    <>
      {/* mobile: stack */}
      <div className="flex flex-col gap-1 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="relative h-[56vw] min-h-[200px]">
            <Card item={item} />
          </div>
        ))}
      </div>
      {/* desktop: original */}
      <div className="hidden md:flex gap-1 h-[380px]">
        {items.map((item) => (
          <div key={item.id} className="flex-1 relative">
            <Card item={item} />
          </div>
        ))}
      </div>
    </>
  )
}

function Row3({ items }: { items: FeaturedTravelItem[] }) {
  const last = items[items.length - 1]
  const rest = items.slice(0, -1)
  return (
    <>
      {/* mobile: stack */}
      <div className="flex flex-col gap-1 md:hidden">
        {[...rest.slice(0, 2), last].filter(Boolean).map((item) => (
          <div key={item!.id} className="relative h-[56vw] min-h-[200px]">
            <Card item={item!} />
          </div>
        ))}
      </div>
      {/* desktop: original */}
      <div className="hidden md:flex gap-1 h-[580px]">
        <div className="flex-1 flex flex-col gap-1">
          {rest.slice(0, 2).map((item) => (
            <div key={item.id} className="flex-1 relative">
              <Card item={item} />
            </div>
          ))}
          {rest.length === 0 && <div className="flex-1 bg-zinc-100" />}
        </div>
        <div className="flex-[2] relative">
          {last && <Card item={last} />}
        </div>
      </div>
    </>
  )
}

export function FeaturedTravelsBlock({ heading, items }: { heading: string; items: FeaturedTravelItem[] }) {
  if (!items.length) return null

  const [r1, r2, r3] = distribute(items)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = sectionRef.current ? Array.from(sectionRef.current.querySelectorAll(':scope > div > *')) : []
      rows.forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          y: 60,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="space-y-1">
        <Row1 items={r1} />
        {r2.length > 0 && <Row2 items={r2} />}
        {r3.length > 0 && <Row3 items={r3} />}
      </div>
    </section>
  )
}
