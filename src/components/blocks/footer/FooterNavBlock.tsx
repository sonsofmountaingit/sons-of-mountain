'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Props = {
  navSectionHeading?: string
}

export function FooterNavBlock({ navSectionHeading = 'НАВИГАЦИЯ' }: Props) {
  const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>([])

  useEffect(() => {
    fetch('/api/footer-data', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setNavLinks(d?.navLinks ?? []))
      .catch(() => {})
  }, [])

  return (
    <div>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>{navSectionHeading}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} style={{ fontSize: '1rem', color: '#ffffff', textDecoration: 'none' }}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
