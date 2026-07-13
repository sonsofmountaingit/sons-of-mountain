'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '@/lib/currency'
import { WaitlistFormModal, type WaitlistItemType } from '@/components/forms/WaitlistFormModal'

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
  itemType?: WaitlistItemType
  spotsAvailable?: number | null
  depositAmount?: number | null
  earlyBirdPrice?: number | null
  earlyBirdUntil?: string | null
  earlyBirdSpots?: number | null
  footerSelector?: string
  onBook?: () => void
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
  earlyBirdPrice,
  earlyBirdUntil,
  earlyBirdSpots,
  footerSelector = 'footer',
  onBook,
}: Props) {
  const isEarlyBird = !!(earlyBirdPrice && earlyBirdUntil && new Date(earlyBirdUntil) > new Date())
  const earlyBirdSpotsLeft = isEarlyBird && earlyBirdSpots != null && spotsAvailable != null
    ? Math.min(spotsAvailable, earlyBirdSpots)
    : null
  const [visible, setVisible] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const isSoldOut = spotsAvailable != null && spotsAvailable === 0

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
    if (isSoldOut) { setWaitlistOpen(true); return }
    if (onBook) { onBook(); return }
    window.dispatchEvent(new Event('open-booking-drawer'))
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
            <span>{durationDays} {durationDays === 1 ? 'ден' : 'дни'}</span>
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
        {(isEarlyBird || price > 0) && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-white">
            {isEarlyBird && (
              <span className="text-amber-400">{formatPrice(earlyBirdPrice!)}</span>
            )}
            <span className={isEarlyBird ? 'line-through text-white/40 font-normal text-xs' : ''}>{formatPrice(price)}</span>
            {earlyBirdSpotsLeft != null && (
              <span className="text-amber-400 font-semibold text-xs">· {earlyBirdSpotsLeft} early bird {earlyBirdSpotsLeft === 1 ? 'място' : 'места'}</span>
            )}
          </span>
        )}

        <div className="w-px h-5 bg-white/20 hidden sm:block" />

        <button
          onClick={handleBook}
          className="bg-orange-700 hover:bg-orange-800 text-white font-black uppercase tracking-widest text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-colors cursor-pointer"
        >
          {isSoldOut ? 'Списък с чакащи' : 'Запиши се'}
        </button>
      </div>

      <WaitlistFormModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        itemType={itemType ?? 'trip'}
        itemId={tripId}
        itemTitle={tripTitle}
      />
    </div>
  )
}
