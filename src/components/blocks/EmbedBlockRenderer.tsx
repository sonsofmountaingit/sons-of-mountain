'use client'

import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface EmbedBlockProps {
  block: {
    embedUrl?: string | null
    height?: string | null
    title?: string | null
    allowFullscreen?: string | null
  } & BlockStyleProps
}

export function EmbedBlockRenderer({ block }: EmbedBlockProps) {
  const { embedUrl, height, title, allowFullscreen, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-6">{title}</h2>}
      <div className="relative w-full rounded-xl overflow-hidden bg-black/20" style={{ height: height || '480px' }}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={allowFullscreen !== 'false'}
            style={{ border: 0 }}
            title={title || 'Embed'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30 text-sm">
            Paste an embed URL (YouTube, Vimeo, Calendly, etc.) in the panel →
          </div>
        )}
      </div>
    </BlockWrapper>
  )
}
