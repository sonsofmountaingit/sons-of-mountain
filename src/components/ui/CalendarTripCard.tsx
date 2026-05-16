'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-client'
import { mediaUrl } from '@/lib/media-url'

export type CalendarItem = {
  id: string
  kind: 'trip' | 'program'
  category: 'bulgaria' | 'abroad' | 'individual'
  title: string
  destinationName: string
  destinationSlug: string | null
  imageUrl: string | null
  imageAlt: string
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  status: 'active' | 'soldOut' | 'draft'
  tags: string[]
  href: string
}

type Props = {
  item: CalendarItem
  isWishlisted: boolean
  loggedIn: boolean
  onWishlistToggle: (item: CalendarItem) => void
  isComparing: boolean
  onCompareToggle: (id: string) => void
}

function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!modalRef.current) return
    const el = modalRef.current
    el.style.opacity = '0'
    el.style.transform = 'scale(0.95)'
    import('gsap').then(({ gsap }) => {
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' })
    })
  }, [])

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn.email({ email, password })
    setLoading(false)
    if (result.error) {
      setError('Невалиден имейл или парола.')
    } else {
      onSuccess()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm print:hidden"
    >
      <div
        ref={modalRef}
        className="bg-zinc-950 border border-white/15 rounded-2xl p-8 w-full max-w-sm mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/25 hover:text-white/70 transition-colors text-sm leading-none"
        >
          ✕
        </button>
        <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1">Sons of Mountains</p>
        <h2 className="text-lg font-semibold text-white mb-6">Влез в профила си</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest text-white/40 uppercase mb-1.5">Имейл</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-white/40 uppercase mb-1.5">Парола</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#F45B26' }}
          >
            {loading ? 'Влизане…' : 'Влез'}
          </button>
        </form>
        <p className="text-xs text-white/25 text-center mt-4">
          Нямаш профил?{' '}
          <a href="/register" className="text-white/50 hover:text-white underline underline-offset-2 transition-colors">
            Регистрирай се
          </a>
        </p>
      </div>
    </div>
  )
}

export function CalendarTripCard({ item, isWishlisted, loggedIn, onWishlistToggle, isComparing, onCompareToggle }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const wishlistBtnRef = useRef<HTMLButtonElement>(null)
  const spotsRef = useRef<HTMLSpanElement>(null)
  const router = useRouter()
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSent, setWaitlistSent] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [spotsCount, setSpotsCount] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const soldOut = item.status === 'soldOut' || item.spotsAvailable === 0
  const firstTag = item.tags[0] ?? null

  // GSAP counter for spots badge on scroll enter
  useEffect(() => {
    if (item.spotsAvailable <= 0 || item.spotsAvailable > 3) return
    if (!spotsRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setSpotsCount(item.spotsAvailable); return }

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        if (!spotsRef.current) return
        const obj = { n: 0 }
        gsap.to(obj, {
          n: item.spotsAvailable,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => setSpotsCount(Math.round(obj.n)),
          scrollTrigger: { trigger: spotsRef.current, start: 'top 90%', once: true },
        })
      })
    })
  }, [item.spotsAvailable])

  function handleMouseEnter() {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced && cardRef.current) {
      cardRef.current.style.transform = 'translateY(-2px)'
    }
    router.prefetch(item.href)
  }

  function handleMouseLeave() {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  async function doWishlistToggle() {
    onWishlistToggle(item)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced && wishlistBtnRef.current) {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(wishlistBtnRef.current!, { scale: 1.15 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
      })
    }
    const method = isWishlisted ? 'DELETE' : 'POST'
    await fetch('/api/wishlist', {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: item.kind, id: item.id }),
    })
  }

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault()
    if (loggedIn) {
      doWishlistToggle()
    } else {
      setShowLoginModal(true)
    }
  }

  async function handleLoginSuccess() {
    setShowLoginModal(false)
    // After login, mark as wishlisted
    onWishlistToggle(item)
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemType: item.kind, id: item.id }),
    })
    // Reload session state without full navigation
    router.refresh()
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: waitlistEmail, itemType: item.kind, itemId: item.id }),
    })
    setWaitlistSent(true)
  }

  function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    const url = `${window.location.origin}/calendar#trip-${item.id}`
    navigator.clipboard.writeText(url).then(() => {
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2000)
    })
  }

  const badgeBase = 'text-[10px] tracking-widest px-2 py-0.5 rounded-full font-semibold'
  let spotsBadge: React.ReactNode = null
  if (soldOut) {
    spotsBadge = <span className={`${badgeBase} text-white`} style={{ background: '#F45B26' }}>НЯМА МЕСТА</span>
  } else if (item.spotsAvailable <= 3) {
    spotsBadge = (
      <span ref={spotsRef} className={`${badgeBase} text-white`} style={{ background: '#F45B26' }}>
        {spotsCount > 0 ? spotsCount : item.spotsAvailable} МЕСТА
      </span>
    )
  } else if (item.spotsAvailable <= 8) {
    spotsBadge = <span className={`${badgeBase} text-white`} style={{ background: '#F45B26' }}>{item.spotsAvailable} МЕСТА</span>
  } else {
    spotsBadge = <span className={`${badgeBase}`} style={{ background: '#F45B2625', color: '#F45B26' }}>{item.spotsAvailable} МЕСТА</span>
  }

  return (
    <>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      <div
        id={`trip-${item.id}`}
        ref={cardRef}
        data-card
        style={{ transition: 'transform 0.2s ease' }}
        className="group"
      >
        {/* Card row + wishlist button */}
        <div className="flex items-stretch gap-0">
          {/* Main card */}
          <div className="flex-1 border border-white/10 rounded-lg hover:border-white/25 transition-colors overflow-hidden">
            <Link
              href={item.href}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex items-center gap-3 p-3"
            >
              {mediaUrl(item.imageUrl) && (
                <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-white/5">
                  <Image src={mediaUrl(item.imageUrl)!} alt={item.imageAlt} width={56} height={56} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {firstTag && (
                  <span className="text-[9px] tracking-widest text-white/30 uppercase">{firstTag}</span>
                )}
                <p className="font-medium text-sm leading-snug truncate group-hover:text-white/80 transition-colors text-white/70">
                  {item.title}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {new Date(item.startDate).toLocaleDateString('bg-BG')} — {new Date(item.endDate).toLocaleDateString('bg-BG')}
                </p>
                <div className="mt-1.5">{spotsBadge}</div>
              </div>
            </Link>
          </div>

          {/* Wishlist button — outside card, vertical rotated text */}
          <button
            ref={wishlistBtnRef}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? 'Премахни от любими' : 'Добави в любими'}
            className={[
              'flex items-center justify-center ml-1.5 rounded-lg border transition-all duration-200 flex-shrink-0 print:hidden',
              isWishlisted
                ? 'border-[#F45B26]/50 bg-[#F45B26]/10 text-[#F45B26]'
                : 'border-white/8 bg-transparent text-white/20 hover:text-[#F45B26] hover:bg-[#F45B26]/5 hover:border-[#F45B26]/25',
            ].join(' ')}
            style={{ width: '22px' }}
          >
            <span
              className="text-[8px] tracking-[0.2em] uppercase font-semibold leading-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {isWishlisted ? '♥ SAVED' : '♡ WISH'}
            </span>
          </button>
        </div>

        {/* Compare + Share row */}
        <div className="px-1 pt-1 print:hidden flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-white/15 hover:text-white/35 transition-colors">
            <input
              type="checkbox"
              checked={isComparing}
              onChange={() => onCompareToggle(item.id)}
              className="accent-white w-3 h-3"
            />
            Сравни
          </label>
          <button
            onClick={handleShare}
            aria-label="Сподели"
            className="text-[9px] text-white/15 hover:text-white/50 transition-colors"
          >
            ↗ Сподели
          </button>
        </div>

        {soldOut && (
          <div className="px-1 pb-2 print:hidden">
            {!waitlistOpen && !waitlistSent && (
              <button
                onClick={() => setWaitlistOpen(true)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
              >
                Уведоми ме при свободно място
              </button>
            )}
            {waitlistOpen && !waitlistSent && (
              <form onSubmit={handleWaitlist} className="flex gap-2 mt-2">
                <input
                  type="email"
                  required
                  placeholder="имейл"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="flex-1 text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                />
                <button type="submit" className="text-xs text-white/50 hover:text-white transition-colors px-2">
                  ОК
                </button>
              </form>
            )}
            {waitlistSent && <p className="text-xs text-white/40 mt-1">Ще те уведомим.</p>}
          </div>
        )}

        {toastVisible && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-4 py-2 rounded-full z-50 print:hidden">
            Линкът е копиран
          </div>
        )}
      </div>
    </>
  )
}
