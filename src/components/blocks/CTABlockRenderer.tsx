'use client'

import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface CTABlockProps {
  block: BlockStyleProps & {
    headline: string
    body?: string | null
    buttonText?: string | null
    buttonLink?: string | null
    variant?: string | null
    backgroundImage?: { url?: string | null; alt: string } | null
  }
}

export function CTABlockRenderer({ block }: CTABlockProps) {
  const innerClass = block.variant === 'centered' || !block.variant
    ? 'text-center max-w-2xl mx-auto'
    : 'max-w-5xl mx-auto'

  return (
    <BlockWrapper props={{ ...block, bgImage: block.bgImage || block.backgroundImage?.url || '' }}>
      <div className={innerClass}>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{block.headline}</h2>
        {block.body && (
          <p className="text-base text-white/60 mb-8 max-w-xl mx-auto">{block.body}</p>
        )}
        {block.buttonText && block.buttonLink && (
          <Link
            href={block.buttonLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors"
          >
            {block.buttonText}
          </Link>
        )}
      </div>
    </BlockWrapper>
  )
}
