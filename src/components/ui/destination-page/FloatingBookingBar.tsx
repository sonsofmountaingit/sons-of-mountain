'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPriceParts } from '@/lib/currency'
import { WaitlistFormModal, type WaitlistItemType } from '@/components/forms/WaitlistFormModal'
import { useTranslations } from '@/lib/use-translations'
import { getSpotsLabel, isSpotsLow } from '@/lib/spots'

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
  spotsTotal?: number | null
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
  spotsTotal,
  depositAmount,
  earlyBirdPrice,
  earlyBirdUntil,
  earlyBirdSpots,
  footerSelector = 'footer',
  onBook,
}: Props) {
  const isEarlyBird = !!(
    earlyBirdPrice &&
    earlyBirdUntil &&
    new Date(earlyBirdUntil) > new Date() &&
    (earlyBirdSpots == null || earlyBirdSpots > 0)
  )
  const earlyBirdSpotsLeft = isEarlyBird && earlyBirdSpots != null && earlyBirdSpots > 0
    ? earlyBirdSpots
    : null
  const [visible, setVisible] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const isSoldOut = spotsAvailable != null && spotsAvailable === 0
  const spotsLabel = getSpotsLabel(spotsAvailable, spotsTotal)
  const showSpots = spotsAvailable != null
    ? (spotsTotal != null ? isSpotsLow(spotsAvailable, spotsTotal) : true)
    : maxParticipants != null
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

  const priceParts = formatPriceParts(price)
  const earlyBirdParts = earlyBirdPrice != null ? formatPriceParts(earlyBirdPrice) : null

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      className={`fixed bottom-4 sm:bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#1f1f1f] text-white rounded-full pl-2 sm:pl-4 pr-1 sm:pr-1.5 py-1.5 sm:py-1.5 shadow-2xl max-w-[calc(100vw-24px)]">

        {/* Date range or month */}
        {(dateLabel || month) && (
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-white/80 shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="capitalize whitespace-nowrap">{dateLabel ?? month}</span>
          </span>
        )}

        {/* Duration */}
        {durationDays && (
          <>
            <div className="hidden sm:block w-px h-4 bg-white/15 shrink-0" />
            <span className="hidden sm:flex items-center gap-1 text-xs text-white/80 shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="whitespace-nowrap">{durationDays} {durationDays === 1 ? t.destination_page.day_singular : t.destination_page.day_plural}</span>
            </span>
          </>
        )}

        {/* Spots */}
        {showSpots && (
          <>
            <div className="w-px h-4 bg-white/15 shrink-0" />
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-white/80 shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {spotsAvailable != null
                ? <span className="whitespace-nowrap"><strong className="text-white">{spotsLabel ?? spotsAvailable}</strong> <span className="hidden sm:inline">{t.destination_page.left}</span></span>
                : <span className="whitespace-nowrap">{maxParticipants} {t.destination_page.max}</span>
              }
            </span>
          </>
        )}

        {/* Price */}
        {(isEarlyBird || price > 0) && (
          <>
            <div className="w-px h-4 bg-white/15 shrink-0" />
            <span className="flex flex-col items-start leading-tight shrink-0">
              {isEarlyBird && earlyBirdParts ? (
                <>
                  <span className="flex items-baseline gap-1 text-amber-400 font-bold text-[10px] sm:text-xs whitespace-nowrap">
                    <span>{earlyBirdParts.eur}</span>
                    <span className="text-white/40 line-through font-normal text-[9px] sm:text-[10px]">{priceParts.eur}</span>
                  </span>
                  <span className="text-white/50 font-normal text-[9px] sm:text-[10px] whitespace-nowrap">{earlyBirdParts.bgn}</span>
                </>
              ) : (
                <>
                  <span className="text-white font-bold text-[10px] sm:text-xs whitespace-nowrap">{priceParts.eur}</span>
                  <span className="text-white/50 font-normal text-[9px] sm:text-[10px] whitespace-nowrap">{priceParts.bgn}</span>
                </>
              )}
              {earlyBirdSpotsLeft != null && (
                <span className="hidden sm:inline text-amber-400 font-semibold text-[9px] whitespace-nowrap">{earlyBirdSpotsLeft} {earlyBirdSpotsLeft === 1 ? t.destination_page.early_bird_spot_for : t.destination_page.early_bird_spots_for}</span>
              )}
            </span>
          </>
        )}

        <button
          onClick={handleBook}
          className="shrink-0 bg-orange-700 hover:bg-orange-800 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2 rounded-full transition-colors cursor-pointer min-h-[38px] sm:min-h-[40px] flex items-center justify-center whitespace-nowrap"
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
