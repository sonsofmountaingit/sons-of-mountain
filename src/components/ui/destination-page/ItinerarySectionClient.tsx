'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  days: number[]
}

export function ItineraryNav({ days }: Props) {
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
