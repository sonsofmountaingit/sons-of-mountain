'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

const variantMap: Record<string, string> = {
  'full-width': 'w-full',
  contained: 'max-w-3xl mx-auto',
  centered: 'max-w-2xl mx-auto text-center',
}

interface RichTextBlockProps {
  block: BlockStyleProps & {
    content?: unknown
    variant?: string | null
  }
}

export function RichTextBlockRenderer({ block }: RichTextBlockProps) {
  const innerClass = variantMap[block.variant ?? 'contained'] ?? 'max-w-3xl mx-auto'

  return (
    <BlockWrapper props={block} innerClassName={`${innerClass} prose prose-invert max-w-none`}>
      {block.content ? <RichText data={block.content as Parameters<typeof RichText>[0]['data']} /> : null}
    </BlockWrapper>
  )
}
