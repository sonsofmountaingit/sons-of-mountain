'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FooterForm } from '@/components/ui/FooterForm'
import { ShakingCredit } from '@/components/ui/ShakingCredit'

type FooterData = {
  subscribeHeading?: string
  subscribeSubtext?: string
  followHeading?: string
  followSubtext?: string
  facebookUrl?: string
  instagramUrl?: string
  facebookFollowers?: string
  instagramFollowers?: string
  travelSectionHeading?: string
  navSectionHeading?: string
  travelLinks?: { label: string; href: string }[]
  navLinks?: { label: string; href: string }[]
  logo?: { url?: string }
  logoGif?: string
  logoUrl?: string
  copyright?: string
  licenseText?: string
  insuranceText?: string
  creditPrefix?: string
  creditName?: string
  creditUrl?: string
  termsUrl?: string
  termsLabel?: string
  privacyUrl?: string
  privacyLabel?: string
  submitLabel?: string
  firstNamePlaceholder?: string
  lastNamePlaceholder?: string
  emailPlaceholder?: string
  consentText?: string
  consentLinkText?: string
}

type Props = {
  overrides?: Partial<FooterData>
}

export function FooterBlockRenderer({ overrides }: Props = {}) {
  const [data, setData] = useState<FooterData | null>(null)

  useEffect(() => {
    fetch('/api/footer-data', { credentials: 'include' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({}))
  }, [])

  const d: FooterData = { ...(data ?? {}), ...(overrides ?? {}) }

  const subscribeHeading = d.subscribeHeading ?? 'Абонирай се'
  const subscribeSubtext = d.subscribeSubtext ?? 'Научавай първи за предстоящи пътешествия, отстъпки и събития.'
  const followHeading = d.followHeading ?? 'Последвай ни!'
  const followSubtext = d.followSubtext ?? 'Стани част от нашата общност и следи приключенията ни отблизо.'
  const facebookUrl = d.facebookUrl ?? 'https://facebook.com/panicframe'
  const instagramUrl = d.instagramUrl ?? 'https://instagram.com/panicframe'
  const facebookFollowers = d.facebookFollowers ?? '20.2K'
  const instagramFollowers = d.instagramFollowers ?? '23.8K'
  const travelSectionHeading = d.travelSectionHeading ?? 'ПЪТУВАЙ С НАС'
  const navSectionHeading = d.navSectionHeading ?? 'НАВИГАЦИЯ'
  const travelLinks = d.travelLinks ?? []
  const navLinks = d.navLinks ?? []
  const logoGif = d.logoUrl ?? d.logo?.url ?? d.logoGif ?? 'https://framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png'
  const copyright = d.copyright ?? '© 2018-2026 Паник Фрейм енд Травел'
  const licenseText = d.licenseText ?? 'Номер на лиценз: РК-01-8245 / 28.07.2022'
  const insuranceText = d.insuranceText ?? 'Номер на застрахователна полица: 03700100005995 / 31.08.2025'
  const creditPrefix = d.creditPrefix ?? 'Дизайн и разработка от'
  const creditName = d.creditName ?? 'Netinsky'
  const creditUrl = d.creditUrl ?? 'https://netinsky.com'
  const termsUrl = d.termsUrl ?? '/legal/terms'
  const termsLabel = d.termsLabel ?? 'Общи условия'
  const privacyUrl = d.privacyUrl ?? '/legal/cookies'
  const privacyLabel = d.privacyLabel ?? 'Политика за поверителност'
  const submitLabel = d.submitLabel ?? 'Абонирай се'
  const firstNamePlaceholder = d.firstNamePlaceholder ?? 'Име'
  const lastNamePlaceholder = d.lastNamePlaceholder ?? 'Фамилия'
  const emailPlaceholder = d.emailPlaceholder ?? 'E-mail адрес'
  const consentText = d.consentText ?? 'С натискането на бутона "Абонирай се" се съгласяваш с'
  const consentLinkText = d.consentLinkText ?? 'Политиката ни за поверителност'

  const half = Math.ceil(travelLinks.length / 2)
  const travelCol1 = travelLinks.slice(0, half)
  const travelCol2 = travelLinks.slice(half)

  return (
    <footer style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 220px', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.75rem 0' }}>{subscribeHeading}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>{subscribeSubtext}</p>
              <FooterForm
                privacyUrl={privacyUrl}
                submitLabel={submitLabel}
                firstNamePlaceholder={firstNamePlaceholder}
                lastNamePlaceholder={lastNamePlaceholder}
                emailPlaceholder={emailPlaceholder}
                consentText={consentText}
                consentLinkText={consentLinkText}
              />
            </div>
            <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>{followHeading}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>{followSubtext}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="8" fill="#1877F2"/><path d="M23 17c0-3.314-2.686-6-6-6s-6 2.686-6 6c0 2.995 2.193 5.477 5.063 5.927V18.89h-1.524V17h1.524v-1.323c0-1.504.896-2.334 2.265-2.334.656 0 1.342.117 1.342.117v1.476h-.756c-.744 0-.976.462-.976.936V17h1.66l-.265 1.89h-1.395v4.037C20.807 22.477 23 19.995 23 17z" fill="white"/></svg>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{facebookFollowers}</span>
                </a>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><defs><radialGradient id="ig-puck" cx="30%" cy="107%" r="120%"><stop offset="0%" stopColor="#ffd600"/><stop offset="30%" stopColor="#ff6930"/><stop offset="60%" stopColor="#fe3b93"/><stop offset="100%" stopColor="#9e34d4"/></radialGradient></defs><rect width="34" height="34" rx="8" fill="url(#ig-puck)"/><rect x="9" y="9" width="16" height="16" rx="4.5" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="17" cy="17" r="4" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="22" cy="12" r="1" fill="white"/></svg>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{instagramFollowers}</span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>{travelSectionHeading}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {travelCol1.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ textDecoration: 'none' }}>
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{link.label.split('/')[0]?.trim()}</span>
                      {link.label.includes('/') && <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{link.label.split('/')[1]?.trim()}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {travelCol2.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ textDecoration: 'none' }}>
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{link.label.split('/')[0]?.trim()}</span>
                      {link.label.includes('/') && <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{link.label.split('/')[1]?.trim()}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

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
        </div>

        <div style={{ paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{copyright}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{licenseText}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{insuranceText}</p>
          </div>
          <Image src={logoGif} alt="Panic Frame" width={80} height={80} style={{ opacity: 0.55 }} unoptimized />
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
      </div>
    </footer>
  )
}
