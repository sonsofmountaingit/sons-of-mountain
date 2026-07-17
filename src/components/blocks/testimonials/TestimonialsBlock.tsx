'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/lib/language-context'
import { getDefaultStrings } from '@/lib/get-default-strings'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  id: string
  authorName: string
  quote: string
  role?: string
  instagramHandle?: string
  rating: number
  row: 'top' | 'bottom'
  avatar?: { url?: string; alt?: string } | null
  cardImage?: { url?: string; alt?: string } | null
}

interface Props {
  heading?: string
  subheading?: string
  topRow: Testimonial[]
  bottomRow: Testimonial[]
}

function Avatar({ t, size = 52 }: { t: Testimonial; size?: number }) {
  const initials = t.authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const palette = ['#2d2d2d', '#3d3d3d', '#4a4a4a', '#555', '#444', '#333']
  const color = palette[t.authorName.charCodeAt(0) % palette.length]

  if (t.avatar?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={t.avatar.url}
        alt={t.authorName}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: '2px solid #e8e8e8',
        }}
      />
    )
  }
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.3 + 'px',
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {initials}
    </div>
  )
}

function Stars({ rating, size = 13, color = '#f5b400' }: { rating: number; size?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.15rem' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? color : 'none'}
          stroke={color}
          strokeWidth="1.5"
        >
          <path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.8 7.1-.7z" />
        </svg>
      ))}
    </div>
  )
}

function SignatureName({ name, instagramHandle }: { name: string; instagramHandle?: string }) {
  const style = {
    fontFamily: "'Caveat', cursive",
    fontWeight: 600,
    fontSize: '1.4rem',
    color: '#ffffff',
    letterSpacing: '0.01em',
    display: 'block',
    lineHeight: 1.2,
  } as const

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');`}</style>
      {instagramHandle ? (
        <a
          href={`https://instagram.com/${instagramHandle.replace(/^@/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ ...style, textDecoration: 'none', cursor: 'pointer' }}
        >
          {name}
        </a>
      ) : (
        <span style={style}>{name}</span>
      )}
    </>
  )
}

function Modal({ t, onClose }: { t: Testimonial; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '1.25rem',
            marginLeft: 'auto',
            marginBottom: '-2rem',
            background: '#f4f4f4',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#666',
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div style={{ marginBottom: '1.75rem' }}>
          <Avatar t={t} size={56} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Stars rating={t.rating} size={15} />
        </div>

        <p style={{
          fontSize: '1rem',
          color: '#444',
          lineHeight: 1.78,
          margin: '0 0 2.5rem 0',
        }}>
          &ldquo;{t.quote}&rdquo;
        </p>

        <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '1.5rem' }}>
          {t.instagramHandle ? (
            <a
              href={`https://instagram.com/${t.instagramHandle.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Caveat', cursive",
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1a1a1a',
                display: 'block',
                lineHeight: 1.2,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >{t.authorName}</a>
          ) : (
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontWeight: 600,
              fontSize: '1.5rem',
              color: '#1a1a1a',
              display: 'block',
              lineHeight: 1.2,
            }}>{t.authorName}</span>
          )}
          {t.role && <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem', display: 'block' }}>{t.role}</span>}
        </div>
      </div>
    </div>
  )
}

function Card({ t, onReadMore }: { t: Testimonial; onReadMore: (t: Testimonial) => void }) {
  return (
    <div className="test-card">
      <style>{`
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      `}</style>

      {t.cardImage?.url && !/\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(t.cardImage.url) ? (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '110px',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.cardImage.url}
            alt={t.cardImage.alt ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.45))',
          }} />
          <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.75rem' }}>
            <Avatar t={t} size={36} />
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '1.25rem' }}>
          <Avatar t={t} size={44} />
        </div>
      )}

      <div style={{ marginBottom: '0.6rem' }}>
        <Stars rating={t.rating} />
      </div>

      <p style={{
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.7,
        margin: 0,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      <button className="test-read-more" onClick={() => onReadMore(t)}>
        More →
      </button>

      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <SignatureName name={t.authorName} instagramHandle={t.instagramHandle} />
        {t.role && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem', display: 'block' }}>{t.role}</span>}
      </div>
    </div>
  )
}

const GAP = 20
const SPEED_PX_PER_SEC = 45

function Row({
  items,
  direction,
  paused,
  onReadMore,
}: {
  items: Testimonial[]
  direction: 'left' | 'right'
  paused: boolean
  onReadMore: (t: Testimonial) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  const posRef = useRef(0)

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    if (!trackRef.current || !wrapRef.current || items.length === 0) return
    let raf = 0
    let killed = false

    raf = requestAnimationFrame(() => {
      if (killed || !trackRef.current) return
      const track = trackRef.current
      const oneSetW = track.scrollWidth / 3
      let last = performance.now()

      const tick = (now: number) => {
        const dt = Math.min(now - last, 50)
        last = now
        if (!pausedRef.current) {
          posRef.current += SPEED_PX_PER_SEC * (dt / 1000)
          posRef.current = posRef.current % oneSetW
        }
        const x = direction === 'left' ? -posRef.current : posRef.current - oneSetW
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
      style={{
        overflow: 'hidden',
        width: '100%',
        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
      }}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: `${GAP}px`, width: 'max-content', willChange: 'transform', paddingLeft: `${GAP}px` }}
      >
        {tripled.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} onReadMore={onReadMore} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsBlock({ heading, subheading, topRow, bottomRow }: Props) {
  if (topRow.length === 0 && bottomRow.length === 0) return null

  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)
  const [hoveredRow, setHoveredRow] = useState<'top' | 'bottom' | null>(null)
  const [modal, setModal] = useState<Testimonial | null>(null)

  const openModal = useCallback((t: Testimonial) => setModal(t), [])
  const closeModal = useCallback(() => setModal(null), [])

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
    <>
      <section
        ref={sectionRef}
        style={{
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
          position: 'relative',
          padding: '5.5rem 0 6rem',
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .test-heading-section { padding: 3.5rem 0 4rem !important; }
          }
        `}</style>

        {(heading || subheading) && (
          <div
            ref={headingRef}
            style={{ padding: '0 clamp(1.5rem, 5vw, 5rem)', marginBottom: '4rem', position: 'relative' }}
          >
            {subheading && (
              <p style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                margin: '0 0 1rem 0',
              }}>
                {subheading}
              </p>
            )}
            {heading && (
              <h2 style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
                fontWeight: 300,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                maxWidth: '700px',
              }}>
                {heading}
              </h2>
            )}
          </div>
        )}

        <div ref={rowsRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {topRow.length > 0 && (
            <div onMouseEnter={() => setHoveredRow('top')} onMouseLeave={() => setHoveredRow(null)}>
              <Row items={topRow} direction="left" paused={hoveredRow === 'top'} onReadMore={openModal} />
            </div>
          )}
          {bottomRow.length > 0 && (
            <div onMouseEnter={() => setHoveredRow('bottom')} onMouseLeave={() => setHoveredRow(null)}>
              <Row items={bottomRow} direction="right" paused={hoveredRow === 'bottom'} onReadMore={openModal} />
            </div>
          )}
        </div>
      </section>

      {modal && <Modal t={modal} onClose={closeModal} />}
    </>
  )
}
