'use client'

import { useEffect, useRef } from 'react'

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
    <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? '#f5c518' : 'rgba(255,255,255,0.12)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ t }: { t: Testimonial }) {
  const initials = t.authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const palette = ['#7c3aed', '#059669', '#b45309', '#c0442a', '#1d4ed8', '#be185d']
  const color = palette[t.authorName.charCodeAt(0) % palette.length]

  if (t.avatar?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={t.avatar.url} alt={t.authorName} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }} />
    )
  }
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0, letterSpacing: '0.03em' }}>
      {initials}
    </div>
  )
}

function Card({ t }: { t: Testimonial }) {
  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '1.25rem',
      padding: '1.5rem',
      width: '300px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: '190px',
    }}>
      <Stars count={t.rating} />
      <p style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 1.65,
        margin: 0,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 6,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {t.quote}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Avatar t={t} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.01em' }}>{t.authorName}</span>
      </div>
    </div>
  )
}

const GAP = 16
const SPEED_PX_PER_SEC = 60

function Row({ items, direction }: { items: Testimonial[]; direction: 'left' | 'right' }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current || !wrapRef.current || items.length === 0) return
    let raf = 0
    let killed = false

    // Wait one frame so the DOM has rendered and scrollWidth is accurate
    raf = requestAnimationFrame(() => {
      if (killed || !trackRef.current) return

      const track = trackRef.current
      // scrollWidth of one set of items (half the tripled track)
      const oneSetW = track.scrollWidth / 3
      // pos always increases from 0; we derive x from it
      let pos = 0
      let last = performance.now()

      const tick = (now: number) => {
        const dt = Math.min(now - last, 50)
        last = now
        pos += SPEED_PX_PER_SEC * (dt / 1000)
        pos = pos % oneSetW
        // left: translate goes 0 → -oneSetW (items march left)
        // right: translate goes -oneSetW → 0 (items march right)
        const x = direction === 'left' ? -pos : pos - oneSetW
        track.style.transform = `translate3d(${x}px,0,0)`
        raf = requestAnimationFrame(tick)
      }

      raf = requestAnimationFrame(tick)
    })

    return () => { killed = true; cancelAnimationFrame(raf) }
  }, [items, direction])

  // triple so wrap is always covered regardless of how many items there are
  const tripled = [...items, ...items, ...items]

  return (
    <div
      ref={wrapRef}
      style={{ overflow: 'hidden', width: '100%', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
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

  return (
    <section style={{ backgroundColor: '#111111', padding: '5rem 0 5.5rem', overflow: 'hidden' }}>
      {(heading || subheading) && (
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 1.5rem' }}>
          {subheading && (
            <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 0.75rem 0' }}>
              {subheading}
            </p>
          )}
          {heading && (
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {heading}
            </h2>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {topRow.length > 0 && <Row items={topRow} direction="left" />}
        {bottomRow.length > 0 && <Row items={bottomRow} direction="right" />}
      </div>
    </section>
  )
}
