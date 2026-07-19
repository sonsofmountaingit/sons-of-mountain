'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '@/lib/currency'
import { WaitlistFormModal, type WaitlistItemType } from '@/components/forms/WaitlistFormModal'
import { useTranslations } from '@/lib/use-translations'

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
  const { t, language } = useTranslations()
  const locale = language === 'EN' ? 'en-US' : 'bg-BG'
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })

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
      <div className="flex items-center gap-1 sm:gap-3 bg-[#1f1f1f] text-white rounded-full pl-2.5 sm:pl-5 pr-1 sm:pr-1.5 py-1.5 sm:py-2 shadow-2xl whitespace-nowrap max-w-[calc(100vw-32px)] overflow-x-auto">

        {/* Date range or month */}
        {(dateLabel || month) && (
          <span className="hidden sm:flex items-center gap-1 text-[11px] sm:text-sm text-white/80">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="capitalize">{dateLabel ?? month}</span>
          </span>
        )}

        {/* Duration */}
        {durationDays && (
          <>
            <div className="hidden sm:block w-px h-4 bg-white/15 shrink-0" />
            <span className="hidden sm:flex items-center gap-1 text-[11px] sm:text-sm text-white/80">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{durationDays}{t.destination_page.day_label}</span>
            </span>
          </>
        )}

        {/* Spots */}
        {(spotsAvailable != null || maxParticipants != null) && (
          <>
            <div className="hidden sm:block w-px h-4 bg-white/15 shrink-0" />
            <span className="hidden sm:flex items-center gap-1 text-[11px] sm:text-sm text-white/80">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {spotsAvailable != null
                ? <span><strong className="text-white">{spotsAvailable}</strong> {t.destination_page.left}</span>
                : <span>{maxParticipants} {t.destination_page.max}</span>
              }
            </span>
          </>
        )}

        {/* Price */}
        {(isEarlyBird || price > 0) && (
          <>
            <div className="hidden sm:block w-px h-4 bg-white/15 shrink-0" />
            <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm font-bold text-white">
              {isEarlyBird && (
                <span className="text-amber-400">{formatPrice(earlyBirdPrice!)}</span>
              )}
              <span className={isEarlyBird ? 'line-through text-white/40 font-normal text-[9px] sm:text-xs' : ''}>{formatPrice(price)}</span>
              {earlyBirdSpotsLeft != null && (
                <span className="hidden sm:inline text-amber-400 font-semibold text-xs">· {t.destination_page.early_bird_label} · {earlyBirdSpotsLeft} {earlyBirdSpotsLeft === 1 ? t.destination_page.spot_word : t.destination_page.spots_word}</span>
              )}
            </span>
          </>
        )}

        <button
          onClick={handleBook}
          className="shrink-0 bg-orange-700 hover:bg-orange-800 text-white font-black uppercase tracking-widest text-[10px] sm:text-sm px-3 sm:px-5 py-2 sm:py-2 rounded-full transition-colors cursor-pointer min-h-[40px] sm:min-h-[44px] flex items-center justify-center"
        >
          {isSoldOut ? t.destination_page.waitlist : t.destination_page.book}
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
