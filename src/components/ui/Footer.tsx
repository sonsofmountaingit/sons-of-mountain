'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const TRAVEL_LINKS = [
  { label: 'Мароко / май', href: '/destinations/morocco' },
  { label: 'Азорски Острови / юли', href: '/destinations/azores' },
  { label: 'Уганда / август', href: '/destinations/uganda' },
  { label: 'Бразилия / септември', href: '/destinations/brazil' },
  { label: 'Empire of Corals', href: '/empire' },
]

const NAV_LINKS = [
  { label: 'Дестинации', href: '/destinations' },
  { label: 'Календар', href: '/calendar' },
  { label: 'Истории', href: '/stories' },
  { label: 'Галерия', href: '/gallery' },
  { label: 'Блог', href: '/blog' },
  { label: 'За нас', href: '/about' },
  { label: 'Яхтен Фестивал', href: '/nolimit' },
  { label: 'Подари ваучер', href: '/gift' },
  { label: 'Контакти', href: '/contact' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          <div className="lg:col-span-1">
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-sm">
              Абонирай се — Научавай първи за предстоящи пътешествия, отстъпки и събития.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="твоят@имейл.com"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Абонирай се'}
              </button>
            </form>
            {status === 'success' && (
              <p className="text-xs text-green-400 mt-2">Абонирахте се успешно!</p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-400 mt-2">Грешка. Опитайте отново.</p>
            )}
          </div>

          <div className="lg:col-span-1">
            <p className="text-sm font-medium text-white mb-4">Последвай ни!</p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/panicframe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/panicframe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-1 grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
                Пътувай с нас
              </p>
              <ul className="space-y-2">
                {TRAVEL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
                Навигация
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
            <p className="text-xs text-white/40">© 2018-2026 Паник Фрейм енд Травел</p>
            <p className="text-xs text-white/30">Номер на лиценз: РК-01-8245 / 28.07.2022</p>
            <p className="text-xs text-white/30">Номер на застрахователна полица: 03700100005995 / 31.08.2025</p>
            <div className="flex gap-4 mt-1">
              <Link href="/legal/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Общи условия
              </Link>
              <Link href="/legal/cookies" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Политика за поверителност
              </Link>
            </div>
            <p className="text-xs text-white/20 mt-1">
              Дизайн и разработка от{' '}
              <a href="https://kickflip.design" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">
                KICKFLIP
              </a>
            </p>
          </div>

          <Image
            src="https://framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png"
            alt="Panic Frame"
            width={120}
            height={120}
            className="h-24 w-auto opacity-60"
            unoptimized
          />
        </div>
      </div>
    </footer>
  )
}
