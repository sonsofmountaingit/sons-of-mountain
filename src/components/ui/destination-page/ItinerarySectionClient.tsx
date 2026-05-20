'use client'

import { useEffect, useRef, useState } from 'react'
import type { ItineraryDay } from './ItinerarySection'
import { DayStatsBar } from './ItinerarySection'
import { RichText } from '@payloadcms/richtext-lexical/react'

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
      { rootMargin: '-40% 0px -55% 0px' }
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
  }

  return (
    <nav className="sticky top-24 flex flex-col gap-2 items-center" aria-label="Навигация по дни">
      {days.map((d) => (
        <button
          key={d}
          onClick={() => scrollTo(d)}
          className={`w-11 h-11 rounded-md text-sm font-semibold transition-colors ${
            active === d
              ? 'bg-black text-white'
              : 'bg-gray-100 text-black/70 hover:bg-gray-200'
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

  return (
    <div className="border-t border-black/10">
      {itinerary.map((day) => {
        const isOpen = open === day.day
        return (
          <div key={day.day} className={`border-b border-black/10 ${isOpen ? 'border border-black rounded-sm mb-1' : ''}`}>
            <button
              className="w-full flex items-start gap-4 py-4 px-3 text-left"
              onClick={() => setOpen(isOpen ? null : day.day)}
              aria-expanded={isOpen}
            >
              <span className="text-xs font-bold tracking-widest text-black/40 uppercase pt-0.5 w-10 flex-shrink-0">
                ДЕН {day.day}
              </span>
              <span className="flex-1 text-base font-bold leading-snug">{day.title}</span>
              <span className="flex-shrink-0 text-xl text-black/50 ml-2 mt-0.5 leading-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="px-3 pb-5">
                {day.content && (
                  <div className="prose text-black/70 max-w-none text-sm leading-relaxed mb-3">
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
