'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookingDrawer } from '@/components/ui/destination-page/BookingDrawer'
import type { VideoCard } from '@/components/ui/WhyTravelWithUs'

gsap.registerPlugin(ScrollTrigger)

export type WtuwItem = { icon: 'camera' | 'globe' | 'city'; title: string; body: string }

function formatPrice(price: number, currency: string) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'
  return `${sym}${price.toLocaleString('bg-BG')}`
}

function DifficultyBar({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Трудност</span>
      <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: 'white', borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>{value}%</span>
    </div>
  )
}

function TripVideoCard({
  card,
  index,
  onBook,
  isMobile,
}: {
  card: VideoCard
  index: number
  onBook: () => void
  isMobile: boolean
}) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isLeft = index % 2 === 0
  const tilt = isMobile ? 0 : isLeft ? -6 : 6

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPlaying(true)
    videoRef.current?.play()
  }, [])

  const handlePause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPlaying(false)
    videoRef.current?.pause()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: isMobile ? '100%' : 320,
        flexShrink: 0,
        borderRadius: isMobile ? 16 : 20,
        overflow: 'hidden',
        transform: `rotate(${tilt}deg)`,
        boxShadow: isMobile
          ? '0 8px 32px rgba(0,0,0,0.18)'
          : '0 24px 64px rgba(0,0,0,0.22)',
        cursor: 'pointer',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease',
        aspectRatio: isMobile ? '3/4' : '16/10',
      }}
      onMouseEnter={!isMobile ? e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'rotate(0deg) scale(1.03)'
        el.style.boxShadow = '0 40px 90px rgba(0,0,0,0.32)'
      } : undefined}
      onMouseLeave={!isMobile ? e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = `rotate(${tilt}deg)`
        el.style.boxShadow = '0 24px 64px rgba(0,0,0,0.22)'
      } : undefined}
      onClick={playing ? handlePause : handlePlay}
    >
      {card.posterUrl && !playing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.posterUrl}
          alt={card.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {card.videoUrl && (
        <video
          ref={videoRef}
          src={card.videoUrl}
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: playing ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onEnded={() => setPlaying(false)}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)',
        opacity: playing ? 1 : 0.55,
        transition: 'opacity 0.3s ease',
      }} />

      {!playing && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: isMobile ? 48 : 52,
            height: isMobile ? 48 : 52,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid rgba(255,255,255,0.5)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 16px 14px',
        opacity: playing ? 1 : 0,
        transform: playing ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: playing ? 'auto' : 'none',
      }}>
        <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: 'white', lineHeight: 1.3 }}>{card.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>
            {formatPrice(card.price, card.currency)}
          </span>
          {card.spotsAvailable !== null && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: 'white',
              background: 'rgba(255,255,255,0.18)', borderRadius: 4,
              padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {card.spotsAvailable} места
            </span>
          )}
        </div>
        {card.difficulty !== null && (
          <div style={{ marginBottom: 10 }}>
            <DifficultyBar value={card.difficulty} />
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); onBook() }}
          style={{
            width: '100%', padding: '10px 0',
            background: 'white', color: '#111',
            border: 'none', borderRadius: 8,
            fontSize: 11, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          Резервирай
        </button>
      </div>

      <div style={{
        position: 'absolute', bottom: 14, left: 14, right: 14,
        opacity: playing ? 0 : 1,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
      }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          {card.title}
        </p>
      </div>
    </div>
  )
}

export function WhyTravelWithUsBlock({
  heading = 'ЗАЩО ДА ПЪТУВАШ С НАС?',
  items,
  ctaLabel = 'Научи повече',
  ctaHref = '/about',
  videoCards = [],
}: {
  heading: string
  items: WtuwItem[]
  ctaLabel?: string
  ctaHref?: string
  videoCards?: VideoCard[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [drawerCard, setDrawerCard] = useState<VideoCard | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      })
      gsap.from(leftRef.current, {
        opacity: 0, y: isMobile ? 30 : 0, x: isMobile ? 0 : -60, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      gsap.from(rightRef.current, {
        opacity: 0, y: isMobile ? 30 : 0, x: isMobile ? 0 : 60, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      const itemEls = itemsRef.current ? Array.from(itemsRef.current.children) : []
      gsap.from(itemEls, {
        opacity: 0, y: 32, duration: 0.65, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: itemsRef.current, start: 'top 85%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [isMobile])

  const leftCard = videoCards[0] ?? null
  const rightCard = videoCards[1] ?? null

  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        style={{ padding: '56px 0 48px', background: '#fff', position: 'relative', zIndex: 0, isolation: 'isolate' }}
      >
        {/* Heading + body + CTA */}
        <div ref={headerRef} style={{ padding: '0 24px', textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 7vw, 2rem)',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.15,
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}>
            {heading}
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#888', lineHeight: 1.7, margin: '0 0 24px' }}>
            {items?.[0]?.body ?? ''}
          </p>
          <Link
            href={ctaHref}
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: '#111',
              color: '#fff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
            }}
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Two cards side by side */}
        {(leftCard || rightCard) && (
          <div style={{ display: 'flex', gap: 12, padding: '0 16px', marginBottom: 40 }}>
            {leftCard && (
              <div ref={leftRef} style={{ flex: 1, minWidth: 0 }}>
                <TripVideoCard card={leftCard} index={0} onBook={() => setDrawerCard(leftCard)} isMobile />
              </div>
            )}
            {rightCard && (
              <div ref={rightRef} style={{ flex: 1, minWidth: 0 }}>
                <TripVideoCard card={rightCard} index={1} onBook={() => setDrawerCard(rightCard)} isMobile />
              </div>
            )}
          </div>
        )}

        {/* Items list */}
        <div ref={itemsRef} style={{ padding: '0 24px' }}>
          {(items ?? []).map((item, i) => (
            <div
              key={i}
              style={{
                padding: '20px 0',
                borderTop: i === 0 ? '1px solid #f0f0f0' : 'none',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111', margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>

        {drawerCard && (
          <BookingDrawer
            open={!!drawerCard}
            onClose={() => setDrawerCard(null)}
            tripId={drawerCard.id}
            tripTitle={drawerCard.title}
            price={drawerCard.price}
            currency={drawerCard.currency}
            spotsAvailable={drawerCard.spotsAvailable}
            depositAmount={drawerCard.depositAmount}
            startDate={drawerCard.startDate}
            endDate={drawerCard.endDate}
            durationDays={drawerCard.durationDays}
            month={drawerCard.month}
            itemType={drawerCard.itemType === 'program' ? 'program' : 'trip'}
          />
        )}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      style={{ padding: '100px 24px', background: '#fff', position: 'relative', zIndex: 0, isolation: 'isolate' }}
    >
      <div style={{
        maxWidth: 1100,
        margin: '0 auto 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr 1fr',
        alignItems: 'center',
        gap: 40,
      }}>
        <div ref={leftRef} style={{ display: 'flex', justifyContent: 'flex-end', overflow: 'visible' }}>
          {leftCard
            ? <TripVideoCard card={leftCard} index={0} onBook={() => setDrawerCard(leftCard)} isMobile={false} />
            : <div style={{ width: 300, aspectRatio: '16/10', borderRadius: 20, background: '#f0f0f0' }} />
          }
        </div>

        <div ref={headerRef} style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.15,
            margin: '0 0 20px',
            letterSpacing: '-0.02em',
          }}>
            {heading}
          </h2>
          <p style={{ fontSize: '1rem', color: '#888', lineHeight: 1.7, margin: '0 0 28px' }}>
            {items?.[0]?.body ?? ''}
          </p>
          <Link
            href={ctaHref}
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#111',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            {ctaLabel}
          </Link>
        </div>

        <div ref={rightRef} style={{ display: 'flex', justifyContent: 'flex-start', overflow: 'visible' }}>
          {rightCard
            ? <TripVideoCard card={rightCard} index={1} onBook={() => setDrawerCard(rightCard)} isMobile={false} />
            : <div style={{ width: 300, aspectRatio: '16/10', borderRadius: 20, background: '#f0f0f0' }} />
          }
        </div>
      </div>

      <div ref={itemsRef} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 40,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        {(items ?? []).map((item, i) => (
          <div key={i} style={{ padding: '24px 0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111', marginBottom: 10 }}>{item.title}</h3>
            <p style={{ fontSize: '0.9375rem', color: '#666', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
          </div>
        ))}
      </div>

      {drawerCard && (
        <BookingDrawer
          open={!!drawerCard}
          onClose={() => setDrawerCard(null)}
          tripId={drawerCard.id}
          tripTitle={drawerCard.title}
          price={drawerCard.price}
          currency={drawerCard.currency}
          spotsAvailable={drawerCard.spotsAvailable}
          depositAmount={drawerCard.depositAmount}
          startDate={drawerCard.startDate}
          endDate={drawerCard.endDate}
          durationDays={drawerCard.durationDays}
          month={drawerCard.month}
          itemType={drawerCard.itemType === 'program' ? 'program' : 'trip'}
        />
      )}
    </section>
  )
}
