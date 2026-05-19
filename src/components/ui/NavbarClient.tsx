'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { ProgramsMegaMenu } from './ProgramsMegaMenu'
import { useSession, signOut } from '@/lib/auth-client'
import { CartSheet } from '@/components/shop/CartSheet'
import { useCartStore } from '@/lib/cart-store'

interface NavbarClientProps {
  navLinksLeft: { label: string; href: string }[]
  navLinksRight: { label: string; href: string }[]
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  logoDarkUrl: string
  logoLightUrl: string
}

const LANGUAGES = [
  { code: 'BG', label: 'Български' },
  { code: 'EN', label: 'English' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'RU', label: 'Русский' },
]

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
}

export function NavbarClient({ navLinksLeft, navLinksRight, instagramUrl, facebookUrl, tiktokUrl, logoDarkUrl, logoLightUrl }: NavbarClientProps) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [activeLang, setActiveLang] = useState('BG')
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { scrollY } = useScroll()
  const { data: session } = useSession()

  const [cartOpen, setCartOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const logoSrc = logoHovered ? '/colored-logo.svg' : '/white-logo.svg'
  const allLinks = [...(navLinksLeft ?? []), ...(navLinksRight ?? [])]

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current >= 50)
  })

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // close panels on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (!t.closest('[data-panel="search"]')) setSearchOpen(false)
      if (!t.closest('[data-panel="lang"]')) setLangOpen(false)
      if (!t.closest('[data-panel="profile"]')) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50)
    else setQuery('')
  }, [searchOpen])

  // ESC: first press clears query, second press closes search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (!searchOpen) return
      if (query) {
        setQuery('')
      } else {
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [searchOpen, query])

  // close megamenu when search or lang opens
  useEffect(() => {
    if (searchOpen || langOpen) setMegaOpen(false)
    if (searchOpen || langOpen) setProfileOpen(false)
  }, [searchOpen, langOpen])

  return (
    <>
      <motion.header
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={[
          'fixed left-0 right-0 z-50 transition-all duration-300 overflow-visible',
          scrolled ? 'top-0 backdrop-blur-md bg-black/60' : 'top-2 bg-transparent',
        ].join(' ')}
      >
        <nav className={['relative w-full px-14 flex items-center justify-between transition-all duration-300 whitespace-nowrap overflow-visible', scrolled ? 'h-[56px]' : 'h-[88px]'].join(' ')}>

          {/* Left */}
          <div className="hidden lg:flex items-center gap-5 flex-1">
            <button
              onClick={() => { setMegaOpen((v) => !v); setSearchOpen(false); setLangOpen(false) }}
              className={['flex items-center gap-1.5 text-sm font-medium tracking-widest transition-colors duration-200', megaOpen ? 'text-white' : 'text-white/80 hover:text-white'].join(' ')}
            >
              Програми
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={['transition-transform duration-200', megaOpen ? 'rotate-180' : ''].join(' ')}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {navLinksLeft.map((link, i) => (
              <Link key={`left-${i}`} href={link.href} className="text-sm font-medium tracking-wider text-white/80 hover:text-white transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo placeholder to keep flex spacing */}
          <div className={['flex-shrink-0 mx-4 transition-all duration-300', scrolled ? 'w-10' : 'w-20'].join(' ')} />

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
            {navLinksRight.map((link, i) => (
              <Link key={`right-${i}`} href={link.href} className="text-sm font-medium tracking-wider text-white/80 hover:text-white transition-colors duration-200">
                {link.label}
              </Link>
            ))}

            {session?.user ? (
              <div data-panel="profile" className="relative">
                <button
                  onClick={() => { setProfileOpen((v) => !v); setSearchOpen(false); setLangOpen(false) }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium tracking-widest border border-white/30 text-white/80 hover:text-white hover:border-white transition-colors duration-200 rounded-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                    {(session.user.name?.[0] ?? session.user.email[0]).toUpperCase()}
                  </span>
                  {session.user.name?.split(' ')[0] ?? 'Акаунт'}
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
                      {[
                        { label: 'Профил', href: '/dashboard/profile' },
                        { label: 'Регистрации', href: '/dashboard/registrations' },
                        { label: 'Поръчки', href: '/dashboard/orders' },
                        { label: 'Ваучери', href: '/dashboard/vouchers' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/4 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-white/8 mt-1">
                        <button
                          onClick={async () => { setProfileOpen(false); await signOut(); router.push('/login'); router.refresh() }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-white/4 transition-colors"
                        >
                          Изход
                        </button>
                      </div>
                      <div className="h-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-1.5 text-sm font-medium tracking-widest border border-white/40 text-white/80 hover:text-white hover:border-white transition-colors duration-200 rounded-sm">
                ВХОД
              </Link>
            )}

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/20">

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-white/70 hover:text-white transition-colors"
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

              {/* Search */}
              <div data-panel="search">
                <button
                  onClick={() => { setSearchOpen((v) => !v); setLangOpen(false) }}
                  className={['transition-colors', searchOpen ? 'text-white' : 'text-white/70 hover:text-white'].join(' ')}
                  aria-label="Търсене"
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

              {/* Language */}
              <div data-panel="lang" className="relative">
                <button
                  onClick={() => { setLangOpen((v) => !v); setSearchOpen(false) }}
                  className={['flex items-center gap-1 text-sm font-medium tracking-widest transition-colors', langOpen ? 'text-white' : 'text-white/70 hover:text-white'].join(' ')}
                >
                  {activeLang}
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
                      <p className="px-4 pt-3 pb-2 text-[10px] tracking-widest text-white/30">ЕЗИК</p>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setActiveLang(lang.code); setLangOpen(false) }}
                          className={[
                            'flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors',
                            activeLang === lang.code ? 'text-white bg-white/6' : 'text-white/60 hover:text-white hover:bg-white/4',
                          ].join(' ')}
                        >
                          <span>{lang.label}</span>
                          {activeLang === lang.code && (
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

              {/* Socials */}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-white" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Logo — separate fixed element so backdrop-filter on header cannot clip it */}
      <Link
        href="/"
        className="fixed left-1/2 -translate-x-1/2 top-2 z-[51] flex items-center justify-center"
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <Image src={logoSrc} alt="Logo" width={140} height={140} priority className={['w-auto transition-all duration-300', scrolled ? 'h-10' : 'h-20'].join(' ')} unoptimized />
      </Link>

      {/* Desktop megamenu */}
      <ProgramsMegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />

      {/* Cart sheet */}
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search overlay */}
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
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              data-panel="search"
              className="fixed left-1/2 -translate-x-1/2 top-[var(--nav-height,80px)] z-50 w-full max-w-[600px] px-4"
            >
              <div className="bg-[#0d0d0d]/98 backdrop-blur-2xl border border-white/10 rounded-sm shadow-2xl overflow-hidden">
                {/* Input row */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 flex-shrink-0">
                    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Търси дестинации, истории…"
                    className="flex-1 bg-transparent text-base text-white placeholder-white/30 outline-none tracking-wide"
                  />
                  {query ? (
                    <button onClick={() => setQuery('')} className="text-white/30 hover:text-white/70 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  ) : (
                    <kbd className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
                  )}
                </div>
                {/* Quick links */}
                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-widest text-white/25 mb-3">БЪРЗИ ВРЪЗКИ</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {[
                      { label: 'Дестинации в България', href: '/destinations?type=bulgaria' },
                      { label: 'Дестинации в чужбина', href: '/destinations?type=abroad' },
                      { label: 'Индивидуални пътувания', href: '/destinations?type=trips' },
                      { label: 'Календар', href: '/calendar' },
                      { label: 'Блог', href: '/blog' },
                      { label: 'Магазин', href: '/shop' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors group"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
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
                <Image src={logoSrc} alt="Logo" width={140} height={64} className="h-16 w-auto" unoptimized />
              </Link>
              <button className="p-2 text-white" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-0 px-6 pt-8 overflow-y-auto">
              <div className="border-b border-white/10">
                <button
                  onClick={() => setMobileProgramsOpen((v) => !v)}
                  className="flex items-center justify-between w-full text-2xl font-medium py-3 text-white/80 hover:text-white transition-colors"
                >
                  Програми
                  <svg width="12" height="12" viewBox="0 0 10 6" fill="none" className={['transition-transform duration-200', mobileProgramsOpen ? 'rotate-180' : ''].join(' ')}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <AnimatePresence>
                  {mobileProgramsOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      {[
                        { label: 'В БЪЛГАРИЯ', href: '/destinations?type=bulgaria' },
                        { label: 'В ЧУЖБИНА', href: '/destinations?type=abroad' },
                        { label: 'ИНДИВИДУАЛНО ПРИКЛЮЧЕНИЕ', href: '/destinations?type=trips' },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block pl-4 py-3 text-base font-medium text-white/60 hover:text-white transition-colors border-b border-white/5">
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {allLinks.map((link, i) => (
                <motion.div key={`mobile-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)} className="block text-2xl font-medium py-3 text-white/80 hover:text-white transition-colors border-b border-white/10">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex items-center gap-6 px-6 mt-auto pb-12">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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
