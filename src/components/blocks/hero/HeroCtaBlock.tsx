'use client'

import Link from 'next/link'

interface HeroCtaBlockProps {
  label?: string
  url?: string
  style?: string
  fontSize?: string
  align?: string
}

const ctaClass: Record<string, string> = {
  'filled-white': 'bg-white text-black hover:bg-white/90',
  'filled-black': 'bg-black text-white hover:bg-black/80',
  'outline-white': 'border border-white text-white hover:bg-white/10',
}

export function HeroCtaBlock({
  label = 'Виж всички дестинации',
  url = '/destinations',
  style = 'filled-white',
  fontSize = '0.75rem',
  align = 'center',
}: HeroCtaBlockProps) {
  const cls = ctaClass[style] ?? ctaClass['filled-white']
  const justify = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'

  return (
    <div className={`flex ${justify} mt-4`}>
      <Link
        href={url ?? '/destinations'}
        className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-colors ${cls}`}
        style={{ fontSize }}
      >
        {label}
      </Link>
    </div>
  )
}
