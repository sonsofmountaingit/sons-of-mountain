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
  tiktokUrl?: string
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
  const [logoHovered, setLogoHovered] = useState(false)
  const logoSrc = logoHovered ? '/colored-logo.svg' : '/white-logo.svg'

  useEffect(() => {
    fetch('/api/footer-data', { credentials: 'include' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({}))
  }, [])

  const d: FooterData = { ...(data ?? {}), ...(overrides ?? {}) }

  const subscribeHeading = d.subscribeHeading ?? 'Subscribe'
  const subscribeSubtext = d.subscribeSubtext ?? 'Be the first to know about upcoming journeys, discounts and events.'
  const followHeading = d.followHeading ?? 'Follow us!'
  const followSubtext = d.followSubtext ?? 'Become part of our community and follow our adventures closely.'
  const facebookUrl = d.facebookUrl ?? 'https://facebook.com/sonsofmountains'
  const instagramUrl = d.instagramUrl ?? 'https://instagram.com/sonsofmountains'
  const tiktokUrl = d.tiktokUrl ?? 'https://tiktok.com/@sonsofmountains'
  const facebookFollowers = d.facebookFollowers ?? '20.2K'
  const instagramFollowers = d.instagramFollowers ?? '23.8K'
  const travelSectionHeading = d.travelSectionHeading ?? 'TRAVEL WITH US'
  const navSectionHeading = d.navSectionHeading ?? 'NAVIGATION'
  const travelLinks = d.travelLinks ?? []
  const navLinks = d.navLinks ?? []
  const logoGif = d.logoUrl ?? d.logo?.url ?? d.logoGif ?? 'https://framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png'
  const copyright = d.copyright ?? '© 2018-2026 Sons of Mountains'
  const licenseText = d.licenseText ?? 'License number: '
  const insuranceText = d.insuranceText ?? 'Insurance policy number: '
  const creditPrefix = d.creditPrefix ?? 'Design and development by'
  const creditName = d.creditName ?? 'Netinsky'
  const creditUrl = d.creditUrl ?? 'https://netinsky.com'
  const termsUrl = d.termsUrl ?? '/legal/terms'
  const termsLabel = d.termsLabel ?? 'Terms and Conditions'
  const privacyUrl = d.privacyUrl ?? '/legal/privacy-policy'
  const privacyLabel = d.privacyLabel ?? 'Privacy Policy'
  const submitLabel = d.submitLabel ?? 'Subscribe'
  const firstNamePlaceholder = d.firstNamePlaceholder ?? 'First name'
  const lastNamePlaceholder = d.lastNamePlaceholder ?? 'Last name'
  const emailPlaceholder = d.emailPlaceholder ?? 'Email address'
  const consentText = d.consentText ?? 'С натискането на бутона "Subscribe" се съгласяваш с'
  const consentLinkText = d.consentLinkText ?? 'our Privacy Policy'

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
                {tiktokUrl && (
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#ffffff' }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#000000"/><path d="M15.59 5.19a3.62 3.62 0 0 1-2.83-3.19V2h-2.59v10.25a2.17 2.17 0 0 1-2.16 1.88 2.17 2.17 0 0 1-2.17-2.17 2.17 2.17 0 0 1 2.17-2.17c.21 0 .4.03.59.08V7.26a4.75 4.75 0 0 0-.59-.04 4.75 4.75 0 0 0-4.75 4.75A4.75 4.75 0 0 0 8.01 16.72a4.75 4.75 0 0 0 4.75-4.75V6.52a6.12 6.12 0 0 0 3.58 1.14V5.19a3.64 3.64 0 0 1-.75-.05" fill="white"/></svg>
                  </a>
                )}
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
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{licenseText}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{insuranceText}</p>
          </div>
          <Image src={logoSrc} alt="Logo" width={120} height={120} unoptimized onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)} style={{ cursor: 'pointer' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href={termsUrl} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{termsLabel}</Link>
              <Link href={privacyUrl} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{privacyLabel}</Link>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
              {creditPrefix}{' '}
              <ShakingCredit name={creditName} href={creditUrl} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
