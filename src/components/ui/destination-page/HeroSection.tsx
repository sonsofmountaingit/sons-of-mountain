'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookingDrawer } from './BookingDrawer'

gsap.registerPlugin(ScrollTrigger)

interface GalleryItem { url: string; alt?: string }
interface WeatherData { temp: number; icon: string; description: string }

interface Props {
  title: string
  subtitle?: string | null
  heroImage: string
  heroImageAlt?: string
  heroVideo?: string | null
  heroGallery?: GalleryItem[]
  departureCity?: string | null
  difficulty?: number | null
  spotsAvailable?: number | null
  spotsTotal?: number | null
  avgRating?: number | null
  reviewCount?: number | null
  weather?: WeatherData | null
  startDate?: string | null
  endDate?: string | null
  tripId?: string
  tripTitle?: string
  price?: number
  currency?: string
  depositAmount?: number | null
  durationDays?: number | null
  month?: string | null
  itemType?: 'trip' | 'program'
}

function difficultyLabel(d: number) {
  if (d <= 25) return 'Лесно'
  if (d <= 50) return 'Умерено'
  if (d <= 75) return 'Умерено трудно'
  return 'Трудно'
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={rating >= i || rating >= i - 0.5 ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  )
}

function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<{ months: number; days: number; hours: number } | null>(null)
  useEffect(() => {
    function calc() {
      const diffMs = new Date(target).getTime() - Date.now()
      if (diffMs <= 0) { setParts(null); return }
      const totalDays = Math.floor(diffMs / 86400000)
      setParts({ months: Math.floor(totalDays / 30), days: totalDays % 30, hours: Math.floor((diffMs % 86400000) / 3600000) })
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [target])
  if (!parts) return null
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      До тръгване:{' '}
      {parts.months > 0 && <><strong className="text-white">{parts.months}</strong>м{' '}</>}
      <strong className="text-white">{parts.days}</strong>д{' '}
      <strong className="text-white">{parts.hours}</strong>ч
    </span>
  )
}

export function HeroSection({
  title, subtitle, heroImage, heroImageAlt, heroVideo, heroGallery,
  departureCity, difficulty, spotsAvailable,
  avgRating, reviewCount, weather, startDate, endDate,
  tripId, tripTitle, price = 0, currency = 'EUR',
  depositAmount, durationDays, month, itemType = 'trip',
}: Props) {
  const thumbs = heroGallery?.filter(g => g.url).slice(0, 3) ?? []
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const breadcrumbRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const urgencyRef = useRef<HTMLDivElement>(null)

  // Entrance GSAP timeline on mount
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Background Ken Burns
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { scale: 1.08, x: '1%', y: '1%' },
          { scale: 1, x: '0%', y: '0%', duration: 14, ease: 'power1.out' }
        )
      }

      // Staggered content entrance
      tl.fromTo(breadcrumbRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
        .fromTo(titleRef.current,      { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.25)
        .fromTo(subtitleRef.current,   { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.42)
        .fromTo(metaRef.current,       { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.55)
        .fromTo(ctaRef.current,        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.68)

      if (urgencyRef.current) {
        tl.fromTo(urgencyRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }, 0.3)
      }

      // Parallax background on scroll
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Scroll indicator bouncing entrance then loop
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { opacity: 0, y: 10 },
          { opacity: 0.5, y: 0, duration: 0.6, delay: 1.8,
            onComplete: () => {
              gsap.to(scrollIndicatorRef.current, {
                y: 7, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut'
              })
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Hide scroll indicator on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showVideo = !activeImage && !!heroVideo
  const showImage = !activeImage ? heroImage : activeImage
  const showImageAlt = !activeImage ? (heroImageAlt ?? title) : (thumbs.find(t => t.url === activeImage)?.alt ?? title)
  const urgentSpots = spotsAvailable != null && spotsAvailable > 0 && spotsAvailable <= 3
  const soldOut = spotsAvailable === 0

  return (
    <>
      <section ref={sectionRef} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">

        {/* Background */}
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          {!showVideo ? (
            <Image key={showImage} src={showImage} alt={showImageAlt} fill priority loading="eager"
              quality={90} className="object-cover" sizes="100vw" />
          ) : (
            <video key="video" src={heroVideo!} autoPlay muted loop playsInline
              className="w-full h-full object-cover" />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />

        {/* Urgency badge */}
        {(soldOut || urgentSpots) && (
          <div ref={urgencyRef} className="absolute top-4 right-4 sm:top-6 sm:right-6 md:right-12 z-10 opacity-0">
            {soldOut ? (
              <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                Разпродадено
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Само {spotsAvailable} места
              </span>
            )}
          </div>
        )}

        {/* Bottom content */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 pb-6 sm:pb-10 md:pb-14 flex flex-col gap-2 sm:gap-3">

          <div ref={breadcrumbRef} className="opacity-0">
            <a href="/destinations" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Всички дестинации
            </a>
          </div>

          <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.9] opacity-0">
            {title}
          </h1>

          {subtitle && (
            <p ref={subtitleRef} className="text-sm sm:text-base md:text-lg text-white/75 max-w-lg leading-relaxed opacity-0 line-clamp-3 sm:line-clamp-none">
              {subtitle}
            </p>
          )}

          {/* Meta grid 2×2 */}
          <div ref={metaRef} className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 w-fit opacity-0">
            {departureCity && (
              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
                </svg>
                Излита от {departureCity}
              </span>
            )}
            {difficulty != null && (
              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l4-8 4 4 4-6 4 5"/>
                </svg>
                {difficultyLabel(difficulty)}
              </span>
            )}
            {startDate && <Countdown target={startDate} />}
            {weather && (
              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                <span>{weather.icon}</span>
                <span className="font-semibold text-white">{weather.temp}°C</span>
                <span className="text-white/50">{weather.description}</span>
              </span>
            )}
            {avgRating != null && avgRating > 0 && (
              <span className="inline-flex items-center gap-1.5 text-sm text-white/80 col-span-2">
                <Stars rating={avgRating} />
                <span className="font-semibold text-white">{avgRating.toFixed(1)}</span>
                {reviewCount != null && reviewCount > 0 && (
                  <span className="text-white/50">({reviewCount} отзива)</span>
                )}
              </span>
            )}
          </div>

          {/* CTA + thumbnails */}
          <div ref={ctaRef} className="flex flex-wrap items-end justify-between gap-3 mt-1 opacity-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-sm hover:bg-white/90 transition-colors"
            >
              Резервирай място →
            </button>

            {thumbs.length > 0 && (
              <div className="flex gap-1.5 sm:gap-2">
                {heroVideo && (
                  <button onClick={() => setActiveImage(null)}
                    className={`relative w-12 h-20 sm:w-16 sm:h-24 md:w-24 md:h-36 rounded-sm overflow-hidden flex-shrink-0 ring-2 transition-all ${!activeImage ? 'ring-white' : 'ring-transparent hover:ring-white/60'}`}>
                    <Image src={heroImage} alt={heroImageAlt ?? title} fill className="object-cover" sizes="96px" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </button>
                )}
                {thumbs.map((g, i) => (
                  <button key={i} onClick={() => setActiveImage(g.url)}
                    className={`relative w-12 h-20 sm:w-16 sm:h-24 md:w-24 md:h-36 rounded-sm overflow-hidden flex-shrink-0 ring-2 transition-all ${activeImage === g.url ? 'ring-white' : 'ring-transparent hover:ring-white/60'}`}>
                    <Image src={g.url} alt={g.alt ?? ''} fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-0 transition-opacity duration-500 ${scrolled ? '!opacity-0' : ''}`}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>

        <style>{`
          @keyframes kenBurns {
            from { transform: scale(1.08) translate(1%, 1%); }
            to   { transform: scale(1) translate(0%, 0%); }
          }
        `}</style>
      </section>

      <BookingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tripId={tripId ?? ''}
        tripTitle={tripTitle ?? title}
        price={price}
        currency={currency}
        spotsAvailable={spotsAvailable}
        depositAmount={depositAmount}
        startDate={startDate}
        endDate={endDate}
        durationDays={durationDays}
        month={month}
        itemType={itemType}
      />
    </>
  )
}
