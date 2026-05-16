'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

type FilterMode = 'all' | 'date' | 'featured'

interface GalleryFilterBarProps {
  filter: FilterMode
  onFilter: (f: FilterMode) => void
  slug: string
}

const FILTERS: { key: FilterMode; label: string }[] = [
  { key: 'all', label: 'ВСИЧКИ' },
  { key: 'date', label: 'ПО ДАТА' },
  { key: 'featured', label: 'ИЗБРАНИ' },
]

const SHARE_BUTTONS = [
  { label: 'Facebook', icon: 'F', color: '#1877f2', href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { label: 'X', icon: 'X', color: '#000', href: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
  { label: 'Pinterest', icon: 'P', color: '#e60023', href: (url: string) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}` },
  { label: 'WhatsApp', icon: 'W', color: '#25d366', href: (url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}` },
]

export function GalleryFilterBar({ filter, onFilter, slug }: GalleryFilterBarProps) {
  const underlineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const buttons = container.querySelectorAll<HTMLButtonElement>('[data-filter]')
    const activeBtn = Array.from(buttons).find((b) => b.dataset.filter === filter)
    if (!activeBtn || !underlineRef.current) return
    const rect = activeBtn.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    gsap.to(underlineRef.current, {
      x: rect.left - containerRect.left,
      width: rect.width,
      duration: 0.3,
      ease: 'power2.inOut',
    })
  }, [filter])

  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://panicframe.com/gallery/${slug}`

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(pageUrl) } catch {}
  }

  return (
    <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div ref={containerRef} className="relative flex items-center gap-6">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              data-filter={key}
              onClick={() => onFilter(key)}
              className={`text-xs font-medium tracking-widest pb-1 transition-colors duration-200 ${filter === key ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              {label}
            </button>
          ))}
          <div
            ref={underlineRef}
            className="absolute bottom-0 h-px bg-white"
            style={{ left: 0, width: 60 }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="hidden sm:inline">СПОДЕЛИ</span>
          {SHARE_BUTTONS.map(({ label, icon, color, href }) => (
            <a
              key={label}
              href={href(pageUrl)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: color }}
            >
              {icon}
            </a>
          ))}
          <button
            onClick={handleCopy}
            aria-label="Copy link"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
