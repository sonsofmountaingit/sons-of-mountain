'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'

interface Props {
  month?: string | null
  maxParticipants?: number | null
  durationDays?: number | null
  price: number
  currency: string
  tripId: string
  tripTitle: string
  itemType?: 'trip' | 'program'
  spotsAvailable?: number | null
  depositAmount?: number | null
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
  tripId,
  tripTitle,
  itemType = 'trip',
  spotsAvailable,
  depositAmount,
  footerSelector = 'footer',
}: Props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const scrollY = window.scrollY
        const winH = window.innerHeight

        if (scrollY < 80) {
          setVisible(false)
          return
        }

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
    setVisible(true)
    return () => window.removeEventListener('scroll', onScroll)
  }, [footerSelector])

  function handleBook() {
    setLoading(true)
    addItem({
      id: `${itemType}-${tripId}`,
      type: itemType,
      title: tripTitle,
      unitPrice: price,
      quantity: 1,
      tripId: itemType === 'trip' ? tripId : undefined,
      programId: itemType === 'program' ? tripId : undefined,
      spotsAvailable: spotsAvailable ?? undefined,
      depositAmount: depositAmount ?? undefined,
    })
    router.push('/shop/checkout')
  }

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-5 bg-[#1f1f1f] text-white rounded-full px-4 sm:px-6 py-3 shadow-2xl whitespace-nowrap">
        {month && (
          <span className="flex items-center gap-1.5 text-sm text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="capitalize">{month}</span>
          </span>
        )}
        {durationDays && (
          <span className="flex items-center gap-1.5 text-sm text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{durationDays} дни</span>
          </span>
        )}
        {maxParticipants && (
          <span className="hidden sm:flex items-center gap-1.5 text-sm text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
            <span>{maxParticipants}</span>
          </span>
        )}
        {price > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white/90">
            <span>{formatPrice(price, currency)}</span>
          </span>
        )}
        <button
          onClick={handleBook}
          disabled={loading}
          className="ml-1 bg-orange-700 hover:bg-orange-800 disabled:opacity-60 text-white font-black uppercase tracking-widest text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-colors cursor-pointer"
        >
          {loading ? '...' : 'Запиши се'}
        </button>
      </div>
    </div>
  )
}
