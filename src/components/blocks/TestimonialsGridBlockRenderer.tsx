'use client'

import Image from 'next/image'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'
import { mediaUrl } from '@/lib/media-url'

interface Testimonial {
  quote: string
  author: string
  role?: string | null
  avatarUrl?: string | null
  rating?: string | null
}

interface TestimonialsGridBlockProps {
  block: { title?: string | null; testimonials: Testimonial[]; columns?: string | null } & BlockStyleProps
}

export function TestimonialsGridBlockRenderer({ block }: TestimonialsGridBlockProps) {
  const { title, testimonials, columns, ...styleProps } = block
  const cols = parseInt(columns || '3')
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-10 text-center">{title}</h2>}
      <div className={`grid grid-cols-1 gap-5 ${gridClass}`}>
        {testimonials.map((t, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/3 flex flex-col gap-4">
            {t.rating && (
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill={j < parseInt(t.rating!) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={j < parseInt(t.rating!) ? 'text-yellow-400' : 'opacity-20'}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            )}
            <blockquote className="text-sm opacity-80 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
            <div className="flex items-center gap-3">
              {mediaUrl(t.avatarUrl) ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                  <Image src={mediaUrl(t.avatarUrl)!} alt={t.author} fill className="object-cover" sizes="36px" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">{t.author[0]}</div>
              )}
              <div>
                <p className="font-semibold text-sm">{t.author}</p>
                {t.role && <p className="text-xs opacity-40">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
