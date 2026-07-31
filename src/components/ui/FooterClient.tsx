'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { translateCmsNavLabel } from '@/lib/translations'
import { FooterLogo } from './FooterLogo'
import { FooterSocialCounter } from './FooterSocialCounter'
import { FooterShakingLink } from './FooterShakingLink'
import { ShakingCredit } from './ShakingCredit'
import { FooterForm } from './FooterForm'
import { FooterReveal } from './FooterReveal'

interface FooterClientProps {
  travelLinks: Array<{ name: string; month: string; href: string }>
  navLinks: Array<{ label: string; href: string }>
  travelSectionHeading: string
  navSectionHeading: string
  followHeading: string
  followSubtext: string
  subscribeHeading: string
  subscribeSubtext: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl?: string
  facebookFollowers: string
  instagramFollowers: string
  logoUrl: string | null
  logoColoredUrl: string | null
  copyright: string
  licenseText: string
  insuranceText: string
  creditPrefix: string
  creditName: string
  creditUrl: string
  termsUrl: string
  privacyUrl: string
  submitLabel: string
  firstNamePlaceholder: string
  lastNamePlaceholder: string
  emailPlaceholder: string
  consentText: string
  consentLinkText: string
}

export function FooterClient({
  travelLinks,
  navLinks,
  travelSectionHeading,
  navSectionHeading,
  followHeading,
  followSubtext,
  subscribeHeading,
  subscribeSubtext,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  facebookFollowers,
  instagramFollowers,
  logoUrl,
  logoColoredUrl,
  copyright,
  licenseText,
  insuranceText,
  creditPrefix,
  creditName,
  creditUrl,
  termsUrl,
  privacyUrl,
  submitLabel,
  firstNamePlaceholder,
  lastNamePlaceholder,
  emailPlaceholder,
  consentText,
  consentLinkText,
}: FooterClientProps) {
  const { language, t } = useLanguage()

  const translateLabel = (label: string): string => {
    return translateCmsNavLabel(label, language)
  }

  const translatedNavLinks = navLinks.map(link => ({
    ...link,
    label: translateLabel(link.label)
  }))

  return (
    <FooterReveal>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.6fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'start' }}>

          {/* Column 1: Travel links */}
          <div data-reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
              {travelSectionHeading}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {travelLinks.map((link, i) => (
                <li key={i} data-reveal>
                  <FooterShakingLink href={link.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ffffff' }}>{link.name}</span>
                    {link.month && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{link.month}</span>}
                  </FooterShakingLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div data-reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
              {navSectionHeading}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {translatedNavLinks.map((link, i) => (
                <li key={i} data-reveal>
                  <FooterShakingLink href={link.href} style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ffffff', textDecoration: 'none' }}>
                    {link.label}
                  </FooterShakingLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Follow / Social */}
          <div data-reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
              {followHeading}
            </p>
            <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
              {followSubtext}
            </p>
            <FooterSocialCounter
              facebookUrl={facebookUrl}
              facebookFollowers={facebookFollowers}
              instagramUrl={instagramUrl}
              instagramFollowers={instagramFollowers}
              tiktokUrl={tiktokUrl}
            />
          </div>

          {/* Column 4: Subscribe + description */}
          <div className="footer-desc-col" data-reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
              {subscribeHeading}
            </p>
            <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1.25rem 0', lineHeight: 1.7 }}>
              {subscribeSubtext}
            </p>
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
        </div>

        {/* Big brand text */}
        <div data-reveal style={{ overflow: 'hidden', paddingTop: '2.5rem', userSelect: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <p style={{
            fontSize: '13vw',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            margin: 0,
            lineHeight: 0.85,
            textTransform: 'uppercase',
            whiteSpace: 'normal',
            textAlign: 'center',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)',
            maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)',
          }}>
            SONS OF<br />MOUNTAIN
          </p>
        </div>

        {/* Bottom bar */}
        <div data-reveal className="footer-bottom" style={{ paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <FooterLogo logoUrl={logoUrl} logoColoredUrl={logoColoredUrl} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{copyright}</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{licenseText}</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{insuranceText}</p>
            </div>
          </div>

          <div className="footer-bottom-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link href={termsUrl} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                {t.footer.terms}
              </Link>
              <Link href={privacyUrl} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                {t.footer.privacy}
              </Link>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              {creditPrefix}{' '}
              <ShakingCredit name={creditName} href={creditUrl} />
            </p>
          </div>
        </div>
      </div>
    </FooterReveal>
  )
}
