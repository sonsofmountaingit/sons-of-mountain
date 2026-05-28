'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'

interface Props {
  month?: string | null
  startDate?: string | null
  endDate?: string | null
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
  onBook?: () => void
}

function formatPrice(price: number, currency: string) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'
  return `${sym}${price.toLocaleString('bg-BG')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' })
}

export function FloatingBookingBar({
  month,
  startDate,
  endDate,
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
  onBook,
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
        if (window.scrollY < 80) { setVisible(false); return }
        const footer = document.querySelector(footerSelector)
        if (footer && footer.getBoundingClientRect().top < window.innerHeight) { setVisible(false); return }
        setVisible(true)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    setVisible(true)
    return () => window.removeEventListener('scroll', onScroll)
  }, [footerSelector])

  function handleBook() {
    if (onBook) { onBook(); return }
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

  const dateLabel = startDate && endDate
    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
    : startDate
    ? formatDate(startDate)
    : null

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4 bg-[#1f1f1f] text-white rounded-full px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl whitespace-nowrap max-w-[calc(100vw-32px)]">

        {/* Date range or month */}
        {(dateLabel || month) && (
          <span className="flex items-center gap-1.5 text-sm text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="capitalize">{dateLabel ?? month}</span>
          </span>
        )}

        {/* Duration — hidden on mobile */}
        {durationDays && (
          <span className="hidden sm:flex items-center gap-1.5 text-sm text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{durationDays} дни</span>
          </span>
        )}

        {/* Spots — hidden on mobile */}
        {(spotsAvailable != null || maxParticipants != null) && (
          <span className="hidden sm:flex items-center gap-1.5 text-sm text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {spotsAvailable != null
              ? <span><strong className="text-white">{spotsAvailable}</strong> места</span>
              : <span>{maxParticipants} макс.</span>
            }
          </span>
        )}

        {/* Price */}
        {price > 0 && (
          <span className="flex items-center gap-1 text-sm font-bold text-white">
            <span className="text-white/60 font-normal text-xs">от</span>
            <span>{formatPrice(price, currency)}</span>
          </span>
        )}

        <div className="w-px h-5 bg-white/20 hidden sm:block" />

        <button
          onClick={handleBook}
          disabled={loading}
          className="bg-orange-700 hover:bg-orange-800 disabled:opacity-60 text-white font-black uppercase tracking-widest text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-colors cursor-pointer"
        >
          {loading ? '...' : 'Запиши се'}
        </button>
      </div>
    </div>
  )
}
