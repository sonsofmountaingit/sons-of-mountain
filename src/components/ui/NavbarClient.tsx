'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { ProgramsMegaMenu } from './ProgramsMegaMenu'
import { useSession, signOut } from '@/lib/auth-client'
import { CartSheet } from '@/components/shop/CartSheet'
import { useCartStore, useCartHydrated } from '@/lib/cart-store'
import { useLanguage } from '@/lib/language-context'
import type { Language } from '@/lib/translations'
import { translateCmsNavLabel } from '@/lib/translations'

interface NavbarClientProps {
  navLinksLeft: { label: string; href: string }[]
  navLinksRight: { label: string; href: string }[]
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  logoDarkUrl: string
  logoLightUrl: string
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'BG', label: 'Български' },
  { code: 'EN', label: 'English' },
]

const HIDDEN_NAV_LABELS = new Set(['Blog', 'Istorii', 'Истории', 'Блог', 'Stories'])

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
}

export function NavbarClient({ navLinksLeft, navLinksRight, instagramUrl, facebookUrl, tiktokUrl, logoDarkUrl, logoLightUrl }: NavbarClientProps) {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { scrollY } = useScroll()
  const { data: session } = useSession()

  const [cartOpen, setCartOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const [navHeight, setNavHeight] = useState(80)
  const headerRef = useRef<HTMLElement>(null)
  const cartHydrated = useCartHydrated()
  const rawItemCount = useCartStore((s) => s.itemCount())
  const itemCount = cartHydrated ? rawItemCount : 0
  const pathname = usePathname()
  const LIGHT_PAGES = ['/calendar']
  const isLightPage = LIGHT_PAGES.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const textBase = 'text-white/80 hover:text-white'
  const logoSrc = logoHovered
    ? (logoLightUrl || '/colored-logo.svg')
    : (logoDarkUrl || '/white-logo.svg')

  const translateLabel = (label: string): string => {
    return translateCmsNavLabel(label, language)
  }

  const translatedLinksLeft = navLinksLeft
    .filter(link => !HIDDEN_NAV_LABELS.has(link.label))
    .map(link => ({
      ...link,
      label: translateLabel(link.label)
    }))

  const translatedLinksRight = navLinksRight
    .filter(link => !HIDDEN_NAV_LABELS.has(link.label))
    .map(link => ({
      ...link,
      label: translateLabel(link.label)
    }))

  const allLinks = [...translatedLinksLeft, ...translatedLinksRight]

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current >= 50)
  })

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || megaOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, megaOpen])

  useEffect(() => {
    function measure() {
      if (headerRef.current) setNavHeight(headerRef.current.getBoundingClientRect().height + (scrolled ? 0 : 8))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [scrolled])

  useEffect(() => {
    function handle(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (!t.closest('[data-panel="search"]')) setSearchOpen(false)
      if (!t.closest('[data-panel="lang"]')) setLangOpen(false)
      if (!t.closest('[data-panel="profile"]')) setProfileOpen(false)
      if (!t.closest('[data-panel="megamenu"]') && !t.closest('[data-megamenu-trigger]')) setMegaOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50)
    else setQuery('')
  }, [searchOpen])

  async function handleSearch() {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
    setSearchOpen(false)
  }

  return (
    <>
      <motion.header
        ref={headerRef}
        className={['fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-black/70 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none' : ''].join(' ')}
      >
        <nav className="px-4 sm:px-5 md:px-8 h-16 sm:h-24 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-6 flex-1">
            <button
              data-megamenu-trigger
              onClick={() => { setMegaOpen((v) => !v); setSearchOpen(false); setLangOpen(false) }}
              className={`text-sm font-medium tracking-wider transition-colors duration-200 ${megaOpen ? 'text-white' : textBase}`}
            >
              {t.nav.programs}
            </button>
            {translatedLinksLeft.map((link, i) => (
              <Link key={`left-${i}`} href={link.href} className={`text-sm font-medium tracking-wider transition-colors duration-200 ${textBase}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={['flex-shrink-0 mx-4 transition-all duration-300', scrolled ? 'w-10' : 'w-14 sm:w-20'].join(' ')} />

          <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
            {translatedLinksRight.map((link, i) => (
              <Link key={`right-${i}`} href={link.href} className={`text-sm font-medium tracking-wider transition-colors duration-200 ${textBase}`}>
                {link.label}
              </Link>
            ))}

            {session?.user ? (
              <div data-panel="profile" className="relative">
                <button
                  onClick={() => { setProfileOpen((v) => !v); setSearchOpen(false); setLangOpen(false) }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium tracking-widest border transition-colors duration-200 rounded-sm ${isLightPage && !scrolled ? 'border-zinc-300 text-zinc-700 hover:text-zinc-900 hover:border-zinc-500' : 'border-white/30 text-white/80 hover:text-white hover:border-white'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {session.user.name || session.user.email}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      variants={PANEL_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-[calc(100%+14px)] w-[200px] bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden shadow-2xl"
                    >
                      <Link href="/dashboard" className="block px-4 py-2.5 text-sm hover:bg-white/5 text-white/80 hover:text-white transition-colors border-b border-white/5">
                        {t.profile.my_profile}
                      </Link>
                      <button
                        onClick={() => signOut().then(() => router.push('/'))}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 text-white/80 hover:text-white transition-colors"
                      >
                        {t.profile.logout}
                      </button>
                      <div className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className={`px-4 py-1.5 text-sm font-medium tracking-widest border transition-colors duration-200 rounded-sm ${isLightPage && !scrolled ? 'border-zinc-300 text-zinc-700 hover:text-zinc-900 hover:border-zinc-500' : 'border-white/40 text-white/80 hover:text-white hover:border-white'}`}>
                {t.nav.login}
              </Link>
            )}

            <div className={`flex items-center gap-2.5 pl-3 border-l ${isLightPage && !scrolled ? 'border-zinc-200' : 'border-white/20'}`}>
              <button
                onClick={() => setCartOpen(true)}
                className={`relative transition-colors ${isLightPage && !scrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white'}`}
                aria-label="Cart"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              <div data-panel="search">
                <button
                  onClick={() => { setSearchOpen((v) => !v); setLangOpen(false) }}
                  className={['transition-colors', searchOpen ? (isLightPage && !scrolled ? 'text-zinc-900' : 'text-white') : (isLightPage && !scrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white')].join(' ')}
                  aria-label="Search"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {searchOpen ? (
                      <motion.svg key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </motion.svg>
                    ) : (
                      <motion.svg key="mag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div data-panel="lang" className="relative">
                <button
                  onClick={() => { setLangOpen((v) => !v); setSearchOpen(false) }}
                  className={['flex items-center gap-1 text-sm font-medium tracking-widest transition-colors', langOpen ? (isLightPage && !scrolled ? 'text-zinc-900' : 'text-white') : (isLightPage && !scrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white')].join(' ')}
                >
                  {language}
                  <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className={['transition-transform duration-200', langOpen ? 'rotate-180' : ''].join(' ')}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      variants={PANEL_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-[calc(100%+14px)] w-[180px] bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden shadow-2xl"
                    >
                      <p className="px-4 pt-3 pb-2 text-[10px] tracking-widest text-white/30">{t.search.language}</p>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setLangOpen(false) }}
                          className={[
                            'flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors',
                            language === lang.code ? 'text-white bg-white/6' : 'text-white/60 hover:text-white hover:bg-white/4',
                          ].join(' ')}
                        >
                          <span>{lang.label}</span>
                          {language === lang.code && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      ))}
                      <div className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLightPage && !scrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white'}`} aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLightPage && !scrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white'}`} aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLightPage && !scrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white'}`} aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-2 transition-colors ${isLightPage && !scrolled ? 'text-zinc-700' : 'text-white'}`}
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button className={`p-2 ${isLightPage && !scrolled ? 'text-zinc-700' : 'text-white'}`} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      <Link
        href="/"
        className="fixed left-0 right-0 top-0 h-16 sm:h-24 z-[51] flex items-center justify-center pointer-events-none"
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <Image src={logoSrc} alt="Logo" width={140} height={140} priority className={['w-auto transition-[height] duration-300 pointer-events-auto', scrolled ? 'h-8 sm:h-10' : 'h-14 sm:h-20'].join(' ')} />
      </Link>

      <ProgramsMegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} navHeight={navHeight} />

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              data-panel="search"
              className="fixed top-20 sm:top-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-[500px] px-4 sm:px-5"
            >
              <div className="bg-[#0d0d0d] border border-white/20 rounded-lg overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50">
                    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t.search.placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-transparent text-white outline-none text-sm"
                  />
                </div>
                {query.trim() && (
                  <button
                    onClick={handleSearch}
                    className="w-full px-5 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    {language === 'BG' ? 'Търси' : 'Search'} "{query}"
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 z-[61] w-[85vw] max-w-[300px] bg-[#0d0d0d] border-r border-white/10 flex flex-col pt-20 overflow-hidden lg:hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <button
                className="absolute top-3 right-3 p-2 text-white/70 hover:text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 space-y-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                <button
                  onClick={() => { setMobileOpen(false); setMegaOpen(true) }}
                  className="block w-full text-left px-4 py-3 rounded text-base font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {t.nav.programs}
                </button>
                {allLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded text-base font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-white/10 p-4 space-y-2 flex-shrink-0">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                      {t.profile.my_profile}
                    </Link>
                    <button
                      onClick={() => {
                        signOut().then(() => router.push('/'))
                        setMobileOpen(false)
                      }}
                      className="w-full text-left px-4 py-2.5 rounded text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {t.profile.logout}
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    {t.nav.login}
                  </Link>
                )}

                <div className="flex items-center gap-2 pt-2">
                  {[
                    { code: 'BG', label: 'BG' },
                    { code: 'EN', label: 'EN' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as Language)}
                      className={`flex-1 px-3 py-2 rounded text-[11px] font-bold tracking-widest transition-colors ${
                        language === lang.code ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ProgramsMegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} navHeight={navHeight} />
    </>
  )
}
