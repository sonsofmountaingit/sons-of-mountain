'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface BannerBlockProps {
  block: {
    text: string
    linkText?: string | null
    linkUrl?: string | null
    closeable?: string | null
  } & BlockStyleProps
}

export function BannerBlockRenderer({ block }: BannerBlockProps) {
  const { text, linkText, linkUrl, closeable, ...styleProps } = block
  const [closed, setClosed] = useState(false)

  if (closed) return null

  return (
    <BlockWrapper props={{ ...styleProps, paddingTop: styleProps.paddingTop || '0.75rem', paddingBottom: styleProps.paddingBottom || '0.75rem' }} noDefaultPadding>
      <div className="flex items-center justify-center gap-3 px-6 text-sm font-medium">
        <span>{text}</span>
        {linkText && linkUrl && (
          <Link href={linkUrl} className="underline underline-offset-2 opacity-80 hover:opacity-100 whitespace-nowrap">
            {linkText} →
          </Link>
        )}
        {closeable === 'true' && (
          <button onClick={() => setClosed(true)} className="ml-auto opacity-50 hover:opacity-100 text-lg leading-none absolute right-4">×</button>
        )}
      </div>
    </BlockWrapper>
  )
}
