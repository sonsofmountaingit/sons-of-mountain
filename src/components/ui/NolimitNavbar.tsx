'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'

const LINKS = [
  { label: 'Яхтен Фестивал', href: '/nolimit' },
  { label: 'Програма', href: '/nolimit/itinerary' },
  { label: 'Катамарани', href: '/nolimit/catamarans' },
  { label: 'Галерия', href: '/nolimit/gallery' },
  { label: 'NextGen', href: '/nolimit/nextgen' },
  { label: 'Panicframe.com', href: '/' },
]

export function NolimitNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = lastScrollY.current
    setScrolled(current > 50)
    setVisible(current < 50 || current < previous)
    lastScrollY.current = current
  })

  return (
    <>
      <motion.header
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={['fixed top-0 left-0 right-0 z-50 transition-colors duration-300', scrolled ? 'backdrop-blur-md bg-black/60' : 'bg-transparent'].join(' ')}
      >
        <nav className="mx-auto max-w-[1440px] px-6 h-16 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-6">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs font-medium tracking-wider text-white/80 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/nolimit/sign-up" className="hidden lg:inline-flex px-5 py-2 bg-white text-black text-xs font-semibold rounded hover:bg-white/90 transition-colors">
            Запиши се
          </Link>
          <button className="lg:hidden p-2 text-white" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="flex items-center justify-between px-6 h-16">
              <span className="text-sm font-semibold">NoLimit Festival</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 pt-8">
              {[...LINKS, { label: 'Запиши се', href: '/nolimit/sign-up' }].map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)} className="block text-xl font-medium py-3 text-white/80 hover:text-white transition-colors border-b border-white/10">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
