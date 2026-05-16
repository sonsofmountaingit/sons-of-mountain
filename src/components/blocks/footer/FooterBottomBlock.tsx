'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShakingCredit } from '@/components/ui/ShakingCredit'

type Props = {
  copyright?: string
  licenseText?: string
  insuranceText?: string
  logoUrl?: string
  termsLabel?: string
  termsUrl?: string
  privacyLabel?: string
  privacyUrl?: string
  creditPrefix?: string
  creditName?: string
  creditUrl?: string
}

export function FooterBottomBlock({
  copyright = '© 2018-2026 Паник Фрейм енд Травел',
  licenseText = 'Номер на лиценз: РК-01-8245 / 28.07.2022',
  insuranceText = 'Номер на застрахователна полица: 03700100005995 / 31.08.2025',
  logoUrl = 'https://framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png',
  termsLabel = 'Общи условия',
  termsUrl = '/legal/terms',
  privacyLabel = 'Политика за поверителност',
  privacyUrl = '/legal/cookies',
  creditPrefix = 'Дизайн и разработка от',
  creditName = 'Netinsky',
  creditUrl = 'https://netinsky.com',
}: Props) {
  const [logoHovered, setLogoHovered] = useState(false)
  const logoSrc = logoHovered ? '/colored-logo.svg' : '/white-logo.svg'

  return (
    <div style={{ paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{copyright}</p>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{licenseText}</p>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{insuranceText}</p>
      </div>
      <Image src={logoSrc} alt="Logo" width={120} height={120} unoptimized onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)} style={{ cursor: 'pointer' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href={termsUrl} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{termsLabel}</Link>
          <Link href={privacyUrl} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{privacyLabel}</Link>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          {creditPrefix}{' '}
          <ShakingCredit name={creditName} href={creditUrl} />
        </p>
      </div>
    </div>
  )
}
