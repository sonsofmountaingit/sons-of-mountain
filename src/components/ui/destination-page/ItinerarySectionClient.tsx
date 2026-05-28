'use client'

import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ItineraryDay } from './ItinerarySection'
import { DayStatsBar } from './ItinerarySection'
import { RichText } from '@payloadcms/richtext-lexical/react'

gsap.registerPlugin(ScrollTrigger)

interface NavProps {
  days: number[]
}

export function ItineraryNav({ days }: NavProps) {
  const [active, setActive] = useState(days[0] ?? 1)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const day = Number(e.target.getAttribute('data-day'))
            if (!isNaN(day)) setActive(day)
          }
        }
      },
      { rootMargin: '-20% 0px -75% 0px' }
    )
    days.forEach((d) => {
      const el = document.getElementById(`day-${d}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [days])

  const scrollTo = (day: number) => {
    const el = document.getElementById(`day-${day}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(day)
  }

  return (
    <nav className="flex flex-col gap-2 items-center" aria-label="Навигация по дни">
      {days.map((d) => (
        <button
          key={d}
          onClick={() => scrollTo(d)}
          className={`w-9 h-9 rounded-full text-[11px] font-bold transition-all duration-300 ${
            active === d
              ? 'bg-black text-white shadow-md scale-110'
              : 'text-black/30 hover:text-black hover:bg-black/6'
          }`}
          aria-label={`Ден ${d}`}
        >
          {d}
        </button>
      ))}
    </nav>
  )
}

interface AccordionProps {
  itinerary: ItineraryDay[]
}

export function ItineraryAccordion({ itinerary }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!listRef.current) return
    const items = Array.from(listRef.current.children) as HTMLElement[]
    gsap.from(items, { opacity: 0, x: -30, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: listRef.current, start: 'top 88%', once: true } })
  }, [])

  return (
    <div ref={listRef} className="divide-y divide-black/8">
      {itinerary.map((day) => {
        const isOpen = open === day.day
        return (
          <div key={day.day}>
            <button
              className="w-full flex items-center gap-4 py-5 text-left group"
              onClick={() => setOpen(isOpen ? null : day.day)}
              aria-expanded={isOpen}
            >
              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all duration-200 ${isOpen ? 'bg-black text-white' : 'bg-black/5 text-black/40 group-hover:bg-black/10 group-hover:text-black'}`}>
                {day.day}
              </span>
              <span className="flex-1 text-base font-semibold leading-snug">{day.title}</span>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full border border-black/12 text-black/35 text-sm leading-none transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {isOpen && (
              <div className="pb-6 pl-[52px]">
                {day.content && (
                  <div className="prose text-black/55 max-w-none text-sm leading-relaxed mb-3">
                    <RichText data={day.content as unknown as Parameters<typeof RichText>[0]["data"]} />
                  </div>
                )}
                {day.stats && <DayStatsBar stats={day.stats} />}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
