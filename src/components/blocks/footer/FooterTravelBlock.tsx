'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Props = {
  travelSectionHeading?: string
}

export function FooterTravelBlock({ travelSectionHeading = 'ПЪТУВАЙ С НАС' }: Props) {
  const [travelLinks, setTravelLinks] = useState<{ label: string; href: string }[]>([])

  useEffect(() => {
    fetch('/api/footer-data', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setTravelLinks(d?.travelLinks ?? []))
      .catch(() => {})
  }, [])

  const half = Math.ceil(travelLinks.length / 2)
  const col1 = travelLinks.slice(0, half)
  const col2 = travelLinks.slice(half)

  return (
    <div>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>{travelSectionHeading}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {col1.map((link) => (
            <li key={link.href + link.label}>
              <Link href={link.href} style={{ textDecoration: 'none' }}>
                <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{link.label.split('/')[0]?.trim()}</span>
                {link.label.includes('/') && <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{link.label.split('/')[1]?.trim()}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {col2.map((link) => (
            <li key={link.href + link.label}>
              <Link href={link.href} style={{ textDecoration: 'none' }}>
                <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{link.label.split('/')[0]?.trim()}</span>
                {link.label.includes('/') && <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{link.label.split('/')[1]?.trim()}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
