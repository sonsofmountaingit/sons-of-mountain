'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { formatPrice } from '@/lib/currency'
import { WaitlistFormModal, type WaitlistItemType } from '@/components/forms/WaitlistFormModal'
import { useTranslations } from '@/lib/use-translations'

gsap.registerPlugin(ScrollTrigger)

interface TripSummary {
  id: string
  slug?: string | null
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  price: number
  currency: string
  status: string
}

interface Props {
  name: string
  trips?: TripSummary[]
  included?: { item?: string | null }[]
  notIncluded?: { item?: string | null }[]
  bgImage?: string | null
  bgImageAlt?: string
  bookingHref?: string
  itemType?: WaitlistItemType
  itemId?: string
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export function BookingCtaSection({ name, trips = [], included = [], notIncluded = [], bgImage, bgImageAlt, bookingHref, itemType, itemId }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const { t, language } = useTranslations()
  const locale = language === 'EN' ? 'en-US' : 'bg-BG'
  const formatDate = (d: string) => new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.from(headRef.current, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: headRef.current, start: 'top 85%', once: true } })
      }
      if (cardsRef.current) {
        gsap.from(Array.from(cardsRef.current.children), { opacity: 0, y: 50, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', once: true } })
      }
      if (stepsRef.current) {
        gsap.from(Array.from(stepsRef.current.children), { opacity: 0, x: -30, duration: 0.6, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: stepsRef.current, start: 'top 90%', once: true } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const activeTrip = trips.find((t) => t.status !== 'draft') ?? trips[0]
  const resolvedBookingHref = bookingHref ?? (activeTrip ? (activeTrip.slug ? `/shop/${activeTrip.slug}` : `/shop`) : '#')

  const spotsLeft = activeTrip?.spotsAvailable ?? 0
  const spotsTotal = activeTrip?.spotsTotal ?? 0
  const fillPct = spotsTotal > 0 ? Math.round(((spotsTotal - spotsLeft) / spotsTotal) * 100) : 0
  const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0
  const isFull = spotsLeft === 0

  return (
    <section ref={sectionRef} id="booking" className="relative bg-[#F9FAFB] py-12 sm:py-14 md:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headRef}>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#888] uppercase mb-2 sm:mb-4">
            {t.destination_page.booking_label}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#111] leading-snug sm:leading-tight mb-6 sm:mb-8 md:mb-12 max-w-2xl">
          {t.destination_page.ready_for} {name}?{' '}
            <span className="text-[#888] font-black">
            {t.destination_page.book_and_go}
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Card 1 — booking (highlighted) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-7 flex flex-col justify-between min-h-[300px] sm:min-h-[380px]">
            {bgImage ? (
              <Image
                src={bgImage}
                alt={bgImageAlt ?? name}
                fill
                quality={75}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#c8f135]" />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10">
              <span className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6 border border-white/30 text-[11px] sm:text-xs">
                {activeTrip ? (isSameDay(activeTrip.startDate, activeTrip.endDate) ? formatDate(activeTrip.startDate) : `${formatDate(activeTrip.startDate)} – ${formatDate(activeTrip.endDate)}`) : t.destination_page.upcoming_date}
              </span>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                {t.destination_page.book_your_spot}<br />{t.destination_page.lets_go_together}
              </h3>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8">
              {activeTrip && spotsTotal > 0 && (
                <div className="mb-3 sm:mb-5">
                  <div className="h-1 rounded-full bg-white/20 overflow-hidden mb-1 sm:mb-1.5">
                    <div
                      className={`h-full rounded-full ${isFull ? 'bg-red-400' : isAlmostFull ? 'bg-orange-400' : 'bg-[#c8f135]'}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-white/70">
                    {isFull ? t.destination_page.spots_exhausted : `${spotsLeft} ${t.destination_page.available_of} ${spotsTotal} ${t.destination_page.spots_word}`}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3">
                {!isFull ? (
                  <Link
                    href={resolvedBookingHref}
                    className="flex items-center justify-center w-10 h-10 min-h-[40px] rounded-full bg-white text-[#111] flex-shrink-0 hover:bg-white/90 transition-colors"
                    aria-label={t.destination_page.book}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ) : itemType && itemId ? (
                  <button
                    onClick={() => setWaitlistOpen(true)}
                    className="flex items-center justify-center h-10 min-h-[40px] px-3 sm:px-4 rounded-full bg-white text-[#111] flex-shrink-0 hover:bg-white/90 transition-colors text-xs font-black tracking-wide uppercase"
                  >
                    {t.destination_page.waitlist}
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white/40 flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {activeTrip && (
                  <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase drop-shadow">
                    {formatPrice(activeTrip.price)} {t.destination_page.per_person}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 — included / not included (ghost/dashed) */}
          <div className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#e0e0e0] bg-white/60 p-5 sm:p-7 flex flex-col justify-between min-h-[300px] sm:min-h-[380px]">
            <div>
              <span className="inline-flex items-center bg-[#111] text-white text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6 text-[11px] sm:text-xs">
                {t.destination_page.included_in_price}
              </span>

              {included.length > 0 && (
                <div className="mb-3 sm:mb-5">
                  <ul className="space-y-1.5 sm:space-y-2">
                    {included.map((it, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-[#333] leading-snug">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5 text-[#111]">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {it.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notIncluded.length > 0 && (
                <div className="mt-2 sm:mt-4">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#aaa] uppercase mb-1.5 sm:mb-2">{t.destination_page.not_included}</p>
                  <ul className="space-y-1 sm:space-y-1.5">
                    {notIncluded.map((it, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#999] leading-snug">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 mt-0.5">
                          <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        {it.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#ccc] text-[#aaa] flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#aaa] tracking-widest uppercase">
                {t.destination_page.details_on_booking}
              </span>
            </div>
          </div>
        </div>

        {/* Process steps */}
        <div ref={stepsRef} className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { n: '01', text: t.destination_page.step1 },
            { n: '02', text: t.destination_page.step2 },
            { n: '03', text: t.destination_page.step3 },
          ].map(({ n, text }) => (
            <div key={n} className="flex gap-3 sm:gap-4 items-start">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#bbb] mt-0.5 flex-shrink-0">{n}</span>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-[9px] sm:text-[10px] text-[#aaa] mt-6 sm:mt-8">
          {t.destination_page.book_agree_prefix}{' '}
          <a href="/terms" className="underline hover:text-[#555] transition-colors">{t.destination_page.terms_link}</a>{' '}{t.destination_page.and}{' '}
          <a href="/privacy" className="underline hover:text-[#555] transition-colors">{t.destination_page.privacy_link}</a>.
        </p>
      </div>

      {itemType && itemId && (
        <WaitlistFormModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
          itemType={itemType}
          itemId={itemId}
          itemTitle={name}
        />
      )}
    </section>
  )
}
