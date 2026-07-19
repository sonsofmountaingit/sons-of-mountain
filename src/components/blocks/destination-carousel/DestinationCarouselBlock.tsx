'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { mediaUrl } from '@/lib/media-url'
import { gsap } from 'gsap'
import { useLanguage } from '@/lib/language-context'
import { getDefaultStrings } from '@/lib/get-default-strings'

interface Destination {
  id: string
  name: string
  slug: string
  href?: string
  heroImage?: { url?: string | null } | null
  month?: string
  spotsLabel?: string
  availableSpots?: number
  price?: number
  overrideTitle?: string
  overrideDescription?: string
  overrideButtonText?: string
}

interface DestinationCarouselBlockProps {
  sectionTitle?: string
  destinations?: Destination[]
  headline?: string
  subheading?: string
  emptyMessage?: string
  destinationButtonText?: string
  introSlide?: { headline: string; subheading: string; backgroundImageUrl?: string; buttonText?: string }
}

function DestCard({
  dest,
  isActive,
  onClick,
}: {
  dest: Destination
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`dc-intro-card relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer focus:outline-none transition-all duration-500 ${
        isActive
          ? 'dc-intro-card--active w-[240px] lg:w-[290px] opacity-100 scale-100'
          : 'w-[175px] lg:w-[210px] opacity-60 scale-95 hover:opacity-85 hover:scale-[0.97]'
      }`}
      style={{ aspectRatio: '9/14' }}
    >
      {mediaUrl(dest.heroImage?.url) ? (
        <Image
          src={mediaUrl(dest.heroImage!.url)!}
          alt={dest.name}
          fill
          className="object-cover"
          sizes="240px"
        />
      ) : (
        <div className="absolute inset-0 bg-white/10" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-bold text-white leading-tight">{dest.name}</h3>
        {dest.month && <p className="text-xs text-white/60 lowercase mt-0.5">{dest.month}</p>}
        <div className="flex items-center justify-between mt-2 gap-2">
          {dest.price != null && (
            <span className="text-xs font-bold text-white bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {dest.price} €
            </span>
          )}
          {dest.availableSpots != null && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${dest.availableSpots <= 3 ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white/90'}`}>
              {dest.availableSpots} spots
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export function DestinationCarouselBlock({
  destinations = [],
  headline,
  subheading,
  emptyMessage,
  destinationButtonText,
  introSlide,
}: DestinationCarouselBlockProps) {
  const { language } = useLanguage()
  const strings = getDefaultStrings(language)
  const resolvedHeadline = headline ?? strings.hero?.defaultHeadline
  const resolvedSubheading = subheading ?? strings.hero?.defaultSubtext
  const resolvedButtonText = destinationButtonText ?? strings.destinations.explore
  if (!destinations.length && emptyMessage) {
    return <section className="py-16 text-center text-neutral-400">{emptyMessage}</section>
  }
  const [activeIndex, setActiveIndex] = useState(-1)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftRef = useRef(0)

  const activeDest = activeIndex >= 0 ? destinations[activeIndex] : null
  const showDestinationView = activeIndex >= 0
  const textPanelRef = useRef<HTMLDivElement>(null)
  const cardsPanelRef = useRef<HTMLDivElement>(null)
  const introCardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => {
      const targets = [textPanelRef.current, cardsPanelRef.current].filter(Boolean)
      if (targets.length) gsap.set(targets, { clearProps: 'all' })
    } })
    if (textPanelRef.current) {
      tl.from(textPanelRef.current, { opacity: 0, x: -60, duration: 0.9, ease: 'power3.out' }, 0)
    }
    if (cardsPanelRef.current) {
      tl.from(cardsPanelRef.current, { opacity: 0, x: 80, duration: 0.9, ease: 'power3.out' }, 0.1)
    }
    return () => { tl.kill(); const targets = [textPanelRef.current, cardsPanelRef.current].filter(Boolean); if (targets.length) gsap.set(targets, { clearProps: 'all' }) }
  }, [])

  const handleSelect = useCallback((i: number) => {
    setActiveIndex(prev => prev === i ? -1 : i)
  }, [])

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0)
    scrollLeftRef.current = trackRef.current?.scrollLeft ?? 0
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    trackRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current)
  }
  function onMouseUp() {
    isDragging.current = false
  }

  // Unified layout: intro slide (activeIndex -1) and selected-destination view share the same shell
  {
    const introBgUrl = introSlide?.backgroundImageUrl
    const heroTitle = activeDest?.overrideTitle ?? activeDest?.name ?? introSlide?.headline ?? resolvedHeadline
    const heroSub = activeDest?.overrideDescription ?? introSlide?.subheading ?? resolvedSubheading
    const heroBtnText = activeDest?.overrideButtonText ?? (activeIndex < 0 ? introSlide?.buttonText : undefined) ?? resolvedButtonText
    const heroHref = activeDest ? (activeDest.href ?? `/destinations/${activeDest.slug}`) : '/destinations'

    return (
      <section className={`relative flex overflow-x-hidden bg-[#0a0a0a] -mt-[72px] md:mt-0 md:[min-height:100svh] ${showDestinationView ? '' : 'dc-intro-section'}`} style={{ minHeight: showDestinationView ? 'calc(100svh + 72px)' : undefined }}>
        {/* Background crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeDest?.id ?? 'bg-empty'}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            {activeDest && mediaUrl(activeDest.heroImage?.url) ? (
              <Image
                src={mediaUrl(activeDest.heroImage!.url)!}
                alt={activeDest.name}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : !activeDest && introBgUrl ? (
              <Image
                src={introBgUrl}
                alt="Intro"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Vertical dot nav — hidden on mobile */}
        {destinations.length > 0 && (
          <div className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3">
            {destinations.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`rounded-full transition-all duration-300 focus:outline-none ${
                  i === activeIndex ? 'w-1.5 h-8 bg-white' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile horizontal dot nav */}
        {destinations.length > 0 && showDestinationView && (
          <div className="flex md:hidden absolute bottom-[calc(180px+56px+0.5rem)] left-0 right-0 z-20 flex-row items-center justify-center gap-2">
            {destinations.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`rounded-full transition-all duration-300 focus:outline-none ${
                  i === activeIndex ? 'w-8 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/35'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile styles */}
        <style>{`
          @media (max-width: 767px) {
            .dc-text-panel { position: absolute; top: 140px; bottom: auto; left: 0; right: 0; padding: 0 1.25rem 0.5rem !important; width: 100% !important; max-width: 100vw !important; box-sizing: border-box !important; align-items: center !important; text-align: center !important; justify-content: flex-start !important; overflow: hidden !important; }
            .dc-text-panel > div { width: 100% !important; max-width: 100% !important; align-items: center !important; }
            .dc-hero-title { font-size: clamp(1.5rem, 8vw, 2.75rem) !important; line-height: 1 !important; margin-bottom: 0.5rem !important; width: 100% !important; max-width: 100% !important; overflow-wrap: break-word !important; word-break: break-word !important; hyphens: auto !important; }
            .dc-hero-sub { margin-bottom: 0.75rem !important; max-width: 85vw !important; font-size: 0.75rem !important; }
            .dc-hero-btn { padding: 0.5rem 1rem !important; font-size: 0.65rem !important; gap: 0.375rem !important; align-self: center !important; min-height: 44px !important; display: inline-flex !important; align-items: center !important; }
            .dc-intro-cards { margin-top: 1.25rem !important; width: 100vw !important; max-width: 100vw !important; }
            .dc-intro-cards > div { padding: 0 1.25rem !important; }
            .dc-intro-card { width: 150px !important; aspect-ratio: 9/15 !important; }
            .dc-intro-card.dc-intro-card--active { width: 178px !important; }
            .dc-intro-card h3 { font-size: 0.8rem !important; }
            .dc-intro-section { min-height: 0 !important; height: auto !important; padding-top: 140px !important; padding-bottom: 2.5rem !important; }
            .dc-intro-section .dc-text-panel { position: relative !important; top: auto !important; padding-top: 0 !important; }
          }
        `}</style>

        {/* Text panel */}
        <div ref={textPanelRef} className={`relative z-10 flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-28 py-16 sm:py-28 dc-text-panel ${showDestinationView ? 'w-full md:w-[52%]' : 'w-full'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDest?.id ?? 'text-empty'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white uppercase leading-none mb-4 tracking-tight dc-hero-title">
                {heroTitle}
              </h1>

              {activeDest && (activeDest.month || activeDest.price != null || activeDest.availableSpots != null) && (
                <p className="text-sm text-white/55 mb-3 flex items-center gap-3 dc-hero-sub">
                  {activeDest.month && <span>{activeDest.month}</span>}
                  {activeDest.price != null && <span>{activeDest.price} €</span>}
                  {activeDest.availableSpots != null && (
                    <span className={activeDest.availableSpots <= 3 ? 'text-red-400' : ''}>
                      {activeDest.availableSpots} spots
                    </span>
                  )}
                </p>
              )}

              <p className="text-sm md:text-base text-white/65 mb-6 sm:mb-10 max-w-sm leading-relaxed dc-hero-sub">
                {heroSub}
              </p>

              <Link
                href={heroHref}
                className="self-start inline-flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-md border border-white/25 text-white font-semibold text-sm rounded-lg hover:bg-white/25 transition-colors dc-hero-btn"
              >
                {heroBtnText}
                <span>→</span>
              </Link>

              {!showDestinationView && destinations.length > 0 && (
                <div
                  ref={introCardsRef}
                  className="dc-intro-cards mt-8 sm:mt-10 flex items-center w-full pointer-events-none -mx-5 sm:mx-0"
                >
                  <div
                    ref={trackRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto select-none pb-2 pointer-events-auto w-full px-4 sm:px-0"
                    style={{
                      scrollbarWidth: 'none',
                      maskImage: 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, black 0%, black 90%, transparent 100%)',
                    }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                  >
                    {destinations.map((dest, i) => (
                      <DestCard
                        key={dest.id}
                        dest={dest}
                        isActive={i === activeIndex}
                        onClick={() => handleSelect(i)}
                      />
                    ))}
                    <div className="flex-shrink-0 w-8" />
                  </div>
                </div>
              )}

              {!showDestinationView && destinations.length > 0 && (
                <div className="flex md:hidden mt-4 flex-row items-center justify-center gap-2 pointer-events-auto">
                  {destinations.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className="w-1.5 h-1.5 rounded-full bg-white/35"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Counter */}
          {destinations.length > 0 && (
            <div className="absolute bottom-8 left-12 md:left-20 lg:left-28 font-mono text-xs text-white/40 hidden md:flex items-end gap-1">
              <span className="text-white/90 text-sm font-bold">{String(Math.max(activeIndex + 1, 0)).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(destinations.length).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Right: cards — desktop */}
        {showDestinationView && (
          <div ref={cardsPanelRef} className="absolute inset-y-0 right-0 z-10 hidden md:flex items-center w-[55%] py-24 pointer-events-none">
            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto select-none pb-2 pointer-events-auto w-full pl-4 pr-0"
              style={{
                scrollbarWidth: 'none',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {destinations.map((dest, i) => (
                <DestCard
                  key={dest.id}
                  dest={dest}
                  isActive={i === activeIndex}
                  onClick={() => handleSelect(i)}
                />
              ))}
              <div className="flex-shrink-0 w-8" />
            </div>
          </div>
        )}

        {/* Bottom: cards — mobile */}
        {showDestinationView && (
        <div className="absolute bottom-14 left-0 right-0 z-10 flex md:hidden items-end pb-4 pointer-events-none" style={{ height: '180px' }}>
          <div
            ref={trackRef}
            className="flex gap-2 overflow-x-auto select-none pointer-events-auto w-full px-3"
            style={{ scrollbarWidth: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {destinations.map((dest, i) => (
              <button
                key={dest.id}
                onClick={() => handleSelect(i)}
                className={`relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer focus:outline-none transition-all duration-500 ${
                  i === activeIndex ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                }`}
                style={{ width: 100, height: 160 }}
              >
                {mediaUrl(dest.heroImage?.url) ? (
                  <Image
                    src={mediaUrl(dest.heroImage!.url)!}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-[10px] font-bold text-white leading-tight truncate">{dest.name}</p>
                </div>
              </button>
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>
        </div>
        )}
      </section>
    )
  }
}

