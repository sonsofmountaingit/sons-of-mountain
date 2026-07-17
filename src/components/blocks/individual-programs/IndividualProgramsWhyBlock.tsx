'use client'

import Image from 'next/image'

interface WhyPoint {
  text: string
}

interface Props {
  whyHeading?: string
  whySubtext?: string
  whyImageUrl?: string
  whyPoints?: WhyPoint[]
}

export function IndividualProgramsWhyBlock({
  whyHeading = 'Защо индивидуална програма',
  whySubtext = 'Защото всяко пътешествие е лично и заслужава собствена история.',
  whyImageUrl,
  whyPoints = [],
}: Props) {
  return (
    <section style={{ background: '#0a0a0a', padding: '3rem 1rem sm:6rem sm:2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem sm:3rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
            {whyHeading}
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 2rem', maxWidth: '52ch' }}>
            {whySubtext}
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {whyPoints.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
                <span style={{ color: '#e8501a', fontWeight: 900, marginTop: 2 }}>✓</span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', minHeight: '300px' }}>
          {whyImageUrl && (
            <Image src={whyImageUrl} alt={whyHeading} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          )}
        </div>
      </div>
    </section>
  )
}
