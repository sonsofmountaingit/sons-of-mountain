'use client'

import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'
import { useLanguage } from '@/lib/language-context'
import { getDefaultStrings } from '@/lib/get-default-strings'

interface QuoteBlockProps {
  block: BlockStyleProps & {
    quote: string
    author?: string | null
    role?: string | null
    avatar?: string | null
  }
}

export function QuoteBlockRenderer({ block }: QuoteBlockProps) {
  const { language } = useLanguage()
  const strings = getDefaultStrings(language)
  return (
    <BlockWrapper props={block} innerClassName="max-w-3xl mx-auto text-center">
      <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-6 opacity-80">
        &ldquo;{block.quote}&rdquo;
      </blockquote>
      {block.author && (
        <div>
          {block.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.avatar} alt={block.author} className="w-12 h-12 rounded-full object-cover mx-auto mb-3" />
          )}
          <p className="text-sm font-semibold">{block.author}</p>
          {block.role && <p className="text-xs opacity-40 mt-1">{block.role}</p>}
        </div>
      )}
    </BlockWrapper>
  )
}
