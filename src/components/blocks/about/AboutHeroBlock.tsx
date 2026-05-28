'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  heroHeading?: string
  heroSubtext?: string
  heroCtaLabel?: string
  heroCtaUrl?: string
  heroStatNumber?: string
  heroStatLabel?: string
  heroImageUrl?: string
}

export function AboutHeroBlock({
  heroHeading = 'Ние сме синовете на планините',
  heroSubtext = 'Организираме пътешествия до места, за които повечето хора само мечтаят.',
  heroCtaLabel = 'Разгледай пътуванията',
  heroCtaUrl = '/destinations',
  heroStatNumber = '4 200+',
  heroStatLabel = 'пътешественици с нас',
  heroImageUrl,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll('[data-animate]'),
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.2 }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: 600,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        background: '#0a0a0a',
      }}
    >
      {/* Parallax image */}
      <div
        ref={imgRef}
        style={{
          position: 'absolute',
          inset: '-15% 0',
          zIndex: 0,
        }}
      >
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={heroHeading}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 100%)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)' }} />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 2rem 4rem',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'flex-end',
          gap: '2rem',
        }}
      >
        <div>
          <h1
            data-animate
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: '0 0 1.25rem',
              maxWidth: '16ch',
            }}
          >
            {heroHeading}
          </h1>
          <p
            data-animate
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: 'rgba(255,255,255,0.7)',
              margin: '0 0 2rem',
              maxWidth: '42ch',
              lineHeight: 1.6,
            }}
          >
            {heroSubtext}
          </p>
          <Link
            data-animate
            href={heroCtaUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              background: '#e8501a',
              borderRadius: 50,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            {heroCtaLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>

        {/* Stat badge */}
        <div
          data-animate
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16,
            padding: '1.5rem 2rem',
            textAlign: 'center',
            minWidth: 160,
          }}
        >
          <p style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1 }}>
            {heroStatNumber}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', margin: '0.5rem 0 0', letterSpacing: '0.03em' }}>
            {heroStatLabel}
          </p>
        </div>
      </div>
    </section>
  )
}
