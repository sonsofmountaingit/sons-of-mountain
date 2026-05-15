'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { ProgramsMegaMenu } from './ProgramsMegaMenu'

interface NavbarClientProps {
  navLinksLeft: { label: string; href: string }[]
  navLinksRight: { label: string; href: string }[]
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  logoDarkUrl: string
  logoLightUrl: string
}

export function NavbarClient({ navLinksLeft, navLinksRight, instagramUrl, facebookUrl, tiktokUrl, logoDarkUrl, logoLightUrl }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  const logoSrc = logoDarkUrl || logoLightUrl || 'https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png'
  const allLinks = [...(navLinksLeft ?? []), ...(navLinksRight ?? [])]

  useMotionValueEvent(scrollY, 'change', (current) => {
    if (current < 50) {
      setScrolled(false)
    } else {
      setScrolled(true)
    }
    lastScrollY.current = current
  })

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
          scrolled ? 'backdrop-blur-md bg-black/60' : 'bg-transparent',
        ].join(' ')}
      >
        <nav className={['mx-auto max-w-[1440px] px-6 flex items-center justify-between transition-all duration-300', scrolled ? 'h-14' : 'h-20'].join(' ')}>
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {/* Програми megamenu trigger */}
            <button
              onClick={() => setMegaOpen((v) => !v)}
              className={[
                'flex items-center gap-1.5 text-xs font-medium tracking-widest transition-colors duration-200',
                megaOpen ? 'text-white' : 'text-white/80 hover:text-white',
              ].join(' ')}
            >
              Програми
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className={['transition-transform duration-200', megaOpen ? 'rotate-180' : ''].join(' ')}
              >
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {navLinksLeft.map((link, i) => (
              <Link
                key={`left-${i}`}
                href={link.href}
                className="text-xs font-medium tracking-widest text-white/80 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="flex-shrink-0 mx-8">
            <Image
              src={logoSrc}
              alt="Logo"
              width={140}
              height={64}
              priority
              className={['w-auto transition-all duration-300', scrolled ? 'h-9' : 'h-14'].join(' ')}
              unoptimized
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {navLinksRight.map((link, i) => (
              <Link
                key={`right-${i}`}
                href={link.href}
                className="text-xs font-medium tracking-widest text-white/80 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 border-l border-white/20 pl-4">
              <button className="text-xs font-medium text-white/80 hover:text-white transition-colors">
                BG ▾
              </button>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Desktop megamenu */}
      <ProgramsMegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image
                  src={logoSrc}
                  alt="Logo"
                  width={140}
                  height={64}
                  className="h-16 w-auto"
                  unoptimized
                />
              </Link>
              <button
                className="p-2 text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-0 px-6 pt-8 overflow-y-auto">
              {/* Програми accordion */}
              <div className="border-b border-white/10">
                <button
                  onClick={() => setMobileProgramsOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-2xl font-medium py-3 text-white/80 hover:text-white transition-colors"
                >
                  Програми
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={['transition-transform duration-200', mobileProgramsOpen ? 'rotate-180' : ''].join(' ')}
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <AnimatePresence>
                  {mobileProgramsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {[
                        { label: 'В БЪЛГАРИЯ', href: '/destinations?type=bulgaria' },
                        { label: 'В ЧУЖБИНА', href: '/destinations?type=abroad' },
                        { label: 'ИНДИВИДУАЛНО ПРИКЛЮЧЕНИЕ', href: '/destinations?type=trips' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block pl-4 py-3 text-base font-medium text-white/60 hover:text-white transition-colors border-b border-white/5"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {allLinks.map((link, i) => (
                <motion.div
                  key={`mobile-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-2xl font-medium py-3 text-white/80 hover:text-white transition-colors border-b border-white/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex items-center gap-6 px-6 mt-auto pb-12">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
