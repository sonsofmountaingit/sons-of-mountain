'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { mediaUrl } from '@/lib/media-url'
import { gsap } from 'gsap'

interface Destination {
  id: string
  name: string
  slug: string
  heroImage?: { url?: string | null } | null
  month?: string
  spotsLabel?: string
  availableSpots?: number
  price?: number
}

interface DestinationCarouselBlockProps {
  sectionTitle?: string
  destinations?: Destination[]
  headline?: string
  subheading?: string
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
      className={`relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer focus:outline-none transition-all duration-500 ${
        isActive
          ? 'w-[240px] lg:w-[290px] opacity-100 scale-100'
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
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`w-1.5 h-1.5 rounded-full inline-block ${s <= 4 ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
        <h3 className="text-sm font-bold text-white leading-tight">{dest.name}</h3>
        {dest.month && <p className="text-xs text-white/60 lowercase mt-0.5">{dest.month}</p>}
        <div className="flex items-center justify-between mt-2 gap-2">
          {dest.price != null && (
            <span className="text-xs font-bold text-white bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
              от {dest.price} €
            </span>
          )}
          {dest.availableSpots != null && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${dest.availableSpots <= 3 ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white/90'}`}>
              {dest.availableSpots} места
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export function DestinationCarouselBlock({
  destinations = [],
  headline = 'Преоткривай света с нас!',
  subheading = 'Пътувай с Panic Frame там, където комфортът среща приключението.',
}: DestinationCarouselBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftRef = useRef(0)

  const activeDest = destinations[activeIndex] ?? null
  const textPanelRef = useRef<HTMLDivElement>(null)
  const cardsPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => { gsap.set([textPanelRef.current, cardsPanelRef.current], { clearProps: 'all' }) } })
    if (textPanelRef.current) {
      tl.from(textPanelRef.current, { opacity: 0, x: -60, duration: 0.9, ease: 'power3.out' }, 0)
    }
    if (cardsPanelRef.current) {
      tl.from(cardsPanelRef.current, { opacity: 0, x: 80, duration: 0.9, ease: 'power3.out' }, 0.1)
    }
    return () => { tl.kill(); const targets = [textPanelRef.current, cardsPanelRef.current].filter(Boolean); if (targets.length) gsap.set(targets, { clearProps: 'all' }) }
  }, [])

  const handleSelect = useCallback((i: number) => {
    setActiveIndex(i)
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

  return (
    <section className="relative flex overflow-x-hidden bg-[#0a0a0a]" style={{ minHeight: '100svh' }}>
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
          {activeDest && mediaUrl(activeDest.heroImage?.url) && (
            <Image
              src={mediaUrl(activeDest.heroImage!.url)!}
              alt={activeDest.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
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
      {destinations.length > 0 && (
        <div className="flex md:hidden absolute bottom-[calc(180px+2.5rem)] left-0 right-0 z-20 flex-row items-center justify-center gap-2">
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
          .dc-text-panel { position: absolute; top: 0; bottom: 200px; left: 0; right: 0; padding: 4.5rem 1.5rem 1rem !important; width: 100% !important; align-items: center !important; text-align: center !important; justify-content: center !important; }
          .dc-hero-title { font-size: clamp(2.4rem, 11vw, 3.5rem) !important; line-height: 0.92 !important; margin-bottom: 0.75rem !important; }
          .dc-hero-sub { margin-bottom: 1.25rem !important; max-width: 280px !important; }
          .dc-hero-btn { padding: 0.625rem 1.25rem !important; font-size: 0.75rem !important; gap: 0.5rem !important; align-self: center !important; }
        }
      `}</style>

      {/* Text panel */}
      <div ref={textPanelRef} className="relative z-10 flex flex-col justify-center px-12 md:px-20 lg:px-28 w-full md:w-[52%] py-28 dc-text-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDest?.id ?? 'text-empty'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white uppercase leading-none mb-6 tracking-tight dc-hero-title">
              {activeDest?.name ?? headline}
            </h1>

            <p className="text-sm md:text-base text-white/65 mb-10 max-w-sm leading-relaxed dc-hero-sub">
              {subheading}
            </p>

            <Link
              href={activeDest ? `/destinations/${activeDest.slug}` : '/destinations'}
              className="self-start inline-flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-md border border-white/25 text-white font-semibold text-sm rounded-lg hover:bg-white/25 transition-colors dc-hero-btn"
            >
              Разгледай
              <span>→</span>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Counter */}
        {destinations.length > 0 && (
          <div className="absolute bottom-8 left-12 md:left-20 lg:left-28 font-mono text-xs text-white/40 hidden md:flex items-end gap-1">
            <span className="text-white/90 text-sm font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(destinations.length).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Right: cards — desktop */}
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

      {/* Bottom: cards — mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex md:hidden items-end pb-4 pointer-events-none" style={{ height: '180px' }}>
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto select-none pointer-events-auto w-full px-4"
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
    </section>
  )
}
