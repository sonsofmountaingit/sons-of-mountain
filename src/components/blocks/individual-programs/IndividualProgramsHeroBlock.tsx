'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Props {
  heroHeading?: string
  heroSubtext?: string
  heroCtaLabel?: string
  heroCtaUrl?: string
  heroImageUrl?: string
}

export function IndividualProgramsHeroBlock({
  heroHeading = 'Индивидуални програми',
  heroSubtext = 'Пътуване, скроено изцяло по твоите желания — дестинация, дати, темпо и хора по твой избор.',
  heroCtaLabel = 'Изпрати запитване',
  heroCtaUrl = '#questionnaire',
  heroImageUrl,
}: Props) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt={heroHeading} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 100%)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 2rem 4rem', width: '100%' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 1.25rem', maxWidth: '18ch' }}>
          {heroHeading}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', margin: '0 0 2rem', maxWidth: '48ch', lineHeight: 1.6 }}>
          {heroSubtext}
        </p>
        <Link
          href={heroCtaUrl}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px',
            background: '#e8501a', borderRadius: 50, color: '#fff', fontWeight: 700,
            fontSize: '0.95rem', textDecoration: 'none', letterSpacing: '0.01em',
          }}
        >
          {heroCtaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
