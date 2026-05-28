'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  id: string
  authorName: string
  quote: string
  rating: number
  row: 'top' | 'bottom'
  avatar?: { url?: string; alt?: string } | null
}

interface Props {
  heading?: string
  subheading?: string
  topRow: Testimonial[]
  bottomRow: Testimonial[]
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < count ? '#ffffff' : 'rgba(255,255,255,0.18)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ t }: { t: Testimonial }) {
  const initials = t.authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const palette = ['#6d28d9', '#0d9488', '#b45309', '#c0442a', '#1d4ed8', '#be185d']
  const color = palette[t.authorName.charCodeAt(0) % palette.length]

  if (t.avatar?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={t.avatar.url} alt={t.authorName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.12)' }} />
    )
  }
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: '#fff', flexShrink: 0, letterSpacing: '0.05em' }}>
      {initials}
    </div>
  )
}

const DESTINATION_TAGS = ['Patagonia', 'Alps', 'Dolomites', 'Iceland', 'Nepal', 'Atlas', 'Pyrenees', 'Rockies', 'Andes', 'Carpathians']

function DestinationBadge({ name }: { name: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontSize: '0.65rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.5)',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '999px',
      padding: '0.2rem 0.6rem',
    }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {name}
    </span>
  )
}

function Card({ t }: { t: Testimonial }) {
  const tag = DESTINATION_TAGS[t.authorName.charCodeAt(0) % DESTINATION_TAGS.length]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '1.75rem',
      padding: '1.5rem 1.75rem',
      width: 'min(330px, 80vw)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      minHeight: '220px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* subtle shine line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
        pointerEvents: 'none',
      }} />

      {/* large quote mark */}
      <div style={{
        position: 'absolute',
        top: '0.75rem',
        right: '1.25rem',
        fontSize: '5rem',
        lineHeight: 1,
        color: 'rgba(255,255,255,0.04)',
        fontFamily: 'Georgia, serif',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        &ldquo;
      </div>

      {/* top row: avatar + name + stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
        <Avatar t={t} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em', lineHeight: 1.2 }}>{t.authorName}</span>
          <Stars count={t.rating} />
        </div>
      </div>

      {/* quote */}
      <p style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.72,
        margin: '0 0 1.25rem 0',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {t.quote}
      </p>

      {/* destination badge */}
      <DestinationBadge name={tag} />
    </div>
  )
}

const GAP = 18
const SPEED_PX_PER_SEC = 55

function Row({ items, direction }: { items: Testimonial[]; direction: 'left' | 'right' }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current || !wrapRef.current || items.length === 0) return
    let raf = 0
    let killed = false

    raf = requestAnimationFrame(() => {
      if (killed || !trackRef.current) return

      const track = trackRef.current
      const oneSetW = track.scrollWidth / 3
      let pos = 0
      let last = performance.now()

      const tick = (now: number) => {
        const dt = Math.min(now - last, 50)
        last = now
        pos += SPEED_PX_PER_SEC * (dt / 1000)
        pos = pos % oneSetW
        const x = direction === 'left' ? -pos : pos - oneSetW
        track.style.transform = `translate3d(${x}px,0,0)`
        raf = requestAnimationFrame(tick)
      }

      raf = requestAnimationFrame(tick)
    })

    return () => { killed = true; cancelAnimationFrame(raf) }
  }, [items, direction])

  const tripled = [...items, ...items, ...items]

  return (
    <div
      ref={wrapRef}
      style={{ overflow: 'hidden', width: '100%', maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: `${GAP}px`, width: 'max-content', willChange: 'transform', paddingLeft: `${GAP}px` }}
      >
        {tripled.map((t, i) => <Card key={`${t.id}-${i}`} t={t} />)}
      </div>
    </div>
  )
}

export function TestimonialsBlock({ heading, subheading, topRow, bottomRow }: Props) {
  if (topRow.length === 0 && bottomRow.length === 0) return null

  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%', once: true },
        })
      }

      if (rowsRef.current) {
        const rowEls = Array.from(rowsRef.current.children)
        gsap.from(rowEls, {
          opacity: 0,
          y: 50,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: rowsRef.current, start: 'top 90%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="test-section" style={{ backgroundColor: '#0d0d0d', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        .test-section { padding: 5.5rem 0 6rem; }
        @media (max-width: 767px) { .test-section { padding: 3.5rem 0 4rem; } }
      `}</style>
      {/* ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '40vh',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {(heading || subheading) && (
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1.5rem', position: 'relative' }}>
          {subheading && (
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', margin: '0 0 1rem 0' }}>
              {subheading}
            </p>
          )}
          {heading && (
            <h2 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.85rem)', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.12, letterSpacing: '-0.03em' }}>
              {heading}
            </h2>
          )}
        </div>
      )}

      <div ref={rowsRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {topRow.length > 0 && <Row items={topRow} direction="left" />}
        {bottomRow.length > 0 && <Row items={bottomRow} direction="right" />}
      </div>
    </section>
  )
}
