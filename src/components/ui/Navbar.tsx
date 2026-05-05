'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'

const LEFT_LINKS = [
  { label: 'ДЕСТИНАЦИИ', href: '/destinations' },
  { label: 'КАЛЕНДАР', href: '/calendar' },
  { label: 'ИСТОРИИ', href: '/stories' },
]

const RIGHT_LINKS = [
  { label: 'ГАЛЕРИЯ', href: '/gallery' },
  { label: 'БЛОГ', href: '/blog' },
  { label: 'ЗА НАС', href: '/about' },
  { label: 'КОНТАКТИ', href: '/contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = lastScrollY.current
    if (current < 50) {
      setVisible(true)
      setScrolled(false)
    } else {
      setScrolled(true)
      setVisible(current < previous)
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
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
          scrolled ? 'backdrop-blur-md bg-black/60' : 'bg-transparent',
        ].join(' ')}
      >
        <nav className="mx-auto max-w-[1440px] px-6 h-16 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {LEFT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-widest text-white/80 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="flex-shrink-0 mx-8">
            <Image
              src="https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png"
              alt="Panic Frame"
              width={140}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {RIGHT_LINKS.map((link) => (
              <Link
                key={link.href}
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
              <a
                href="https://instagram.com/panicframe"
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
              <a
                href="https://facebook.com/panicframe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
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
                  src="https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png"
                  alt="Panic Frame"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
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
            <nav className="flex flex-col gap-2 px-6 pt-8">
              {[...LEFT_LINKS, ...RIGHT_LINKS].map((link, i) => (
                <motion.div
                  key={link.href}
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
              <a href="https://instagram.com/panicframe" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://facebook.com/panicframe" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
