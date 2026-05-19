'use client'

import Link from 'next/link'
import Image from 'next/image'

type NavLink = { label: string; href: string }

interface NavigationLinksBlockProps {
  navLinksLeft: NavLink[]
  navLinksRight: NavLink[]
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  logoDarkUrl: string
  logoLightUrl: string
}

export function NavigationLinksBlock({
  navLinksLeft,
  navLinksRight,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  logoDarkUrl,
  logoLightUrl,
}: NavigationLinksBlockProps) {
  const logoSrc = logoDarkUrl || logoLightUrl || 'https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png'
  const allLinks = [...(navLinksLeft ?? []), ...(navLinksRight ?? [])]

  return (
    <div style={{ backgroundColor: '#0a0a0a', padding: '1rem 1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          {(navLinksLeft ?? []).map((link) => (
            <Link key={link.href} href={link.href} style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', textTransform: 'uppercase' }}>
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/" style={{ flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="Logo" style={{ height: 32, width: 'auto' }} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
          {(navLinksRight ?? []).map((link) => (
            <Link key={link.href} href={link.href} style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', textTransform: 'uppercase' }}>
              {link.label}
            </Link>
          ))}
          {(instagramUrl || facebookUrl) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)', marginLeft: '0.5rem' }}>
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {allLinks.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0.5rem 0 0' }}>
          Add navigation links in the panel →
        </p>
      )}
    </div>
  )
}
