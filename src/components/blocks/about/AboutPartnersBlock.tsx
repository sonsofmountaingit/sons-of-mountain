'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Partner {
  name: string
  url?: string
  logoUrl?: string | null
}

interface Props {
  partnersHeading?: string
  partnersSubtext?: string
  partnersCtaLabel?: string
  partnersCtaUrl?: string
  partners?: Partner[]
}

export function AboutPartnersBlock({
  partnersHeading = 'Нашите партньори',
  partnersSubtext = 'Колаборираме с любимите си брандове и медии',
  partnersCtaLabel = 'Стани наш партньор',
  partnersCtaUrl = '/contact',
  partners = [],
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const header = Array.from(sectionRef.current?.querySelectorAll('[data-animate-header]') ?? [])
      if (header.length > 0) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          }
        )
      }

      const logos = Array.from(sectionRef.current?.querySelectorAll('[data-animate-logo]') ?? [])
      if (logos.length > 0) {
        gsap.fromTo(
          logos,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1, scale: 1, stagger: 0.06, duration: 0.6, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#ffffff',
        padding: '8rem 2rem',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2
            data-animate-header
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#0a0a0a',
              margin: '0 0 0.75rem',
            }}
          >
            {partnersHeading}
          </h2>
          <p
            data-animate-header
            style={{
              fontSize: '1rem',
              color: '#6a6a6a',
              margin: 0,
            }}
          >
            {partnersSubtext}
          </p>
        </div>

        {/* Logo grid */}
        {partners.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '2rem 3rem',
              alignItems: 'center',
              justifyItems: 'center',
              marginBottom: '4rem',
            }}
          >
            {partners.map((p, i) => {
              const content = p.logoUrl ? (
                <div style={{ position: 'relative', width: 130, height: 60 }}>
                  <Image
                    src={p.logoUrl}
                    alt={p.name}
                    fill
                    sizes="130px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.03em' }}>
                  {p.name}
                </span>
              )

              return p.url ? (
                <a
                  key={i}
                  data-animate-logo
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={i}
                  data-animate-logo
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}
                >
                  {content}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', fontSize: '0.9rem', marginBottom: '4rem' }}>
            Добави партньори от Payload Admin
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href={partnersCtaUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: '#e8501a',
              borderRadius: 50,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            {partnersCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
