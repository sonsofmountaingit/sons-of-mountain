'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Props {
  month?: string | null
  maxParticipants?: number | null
  durationDays?: number | null
  price: number
  currency: string
  bookingHref: string
  footerSelector?: string
}

function formatPrice(price: number, currency: string) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'
  return `${sym}${price.toLocaleString('bg-BG')}`
}

export function FloatingBookingBar({
  month,
  maxParticipants,
  durationDays,
  price,
  currency,
  bookingHref,
  footerSelector = 'footer',
}: Props) {
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const scrollY = window.scrollY
        const winH = window.innerHeight

        // Hide only before a small scroll threshold (essentially always visible)
        if (scrollY < 80) {
          setVisible(false)
          return
        }

        // Hide when footer is in view
        const footer = document.querySelector(footerSelector)
        if (footer) {
          const rect = footer.getBoundingClientRect()
          if (rect.top < winH) {
            setVisible(false)
            return
          }
        }

        setVisible(true)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Show immediately on mount (page load is at top of hero)
    setVisible(true)
    return () => window.removeEventListener('scroll', onScroll)
  }, [footerSelector])

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-5 bg-[#1f1f1f] text-white rounded-full px-6 py-3 shadow-2xl whitespace-nowrap">
        {month && (
          <span className="flex items-center gap-2 text-sm text-white/80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="capitalize">{month}</span>
          </span>
        )}
        {maxParticipants && (
          <span className="flex items-center gap-2 text-sm text-white/80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{maxParticipants} човека</span>
          </span>
        )}
        {durationDays && (
          <span className="flex items-center gap-2 text-sm text-white/80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>{durationDays} дни</span>
          </span>
        )}
        {price > 0 && (
          <span className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>{formatPrice(price, currency)}</span>
          </span>
        )}
        <Link
          href={bookingHref}
          className="ml-2 bg-orange-700 hover:bg-orange-800 text-white font-black uppercase tracking-widest text-sm px-5 py-2 rounded-full transition-colors"
        >
          Запиши се
        </Link>
      </div>
    </div>
  )
}
