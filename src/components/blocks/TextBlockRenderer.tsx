'use client'

import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

const variantMap: Record<string, string> = {
  'full-width': 'w-full',
  contained: 'max-w-3xl mx-auto',
  'two-column': 'max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12',
  centered: 'max-w-2xl mx-auto text-center',
}

interface TextBlockProps {
  block: BlockStyleProps & {
    heading?: string | null
    content?: string | null
    alignment?: string | null
    variant?: string | null
    padding?: string | null
    ctaText?: string | null
    ctaLink?: string | null
  }
}

export function TextBlockRenderer({ block }: TextBlockProps) {
  const innerClass = variantMap[block.variant ?? 'contained'] ?? 'max-w-3xl mx-auto'

  return (
    <BlockWrapper props={block}>
      <div className={innerClass}>
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{block.heading}</h2>
        )}
        {block.content && (
          <p className="text-base md:text-lg text-white/70 leading-relaxed">{block.content}</p>
        )}
        {block.ctaText && block.ctaLink && (
          <Link
            href={block.ctaLink}
            className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-white border-b border-white/30 pb-0.5 hover:border-white transition-colors"
          >
            {block.ctaText} →
          </Link>
        )}
      </div>
    </BlockWrapper>
  )
}
