'use client'

import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface MapBlockProps {
  block: {
    embedUrl: string
    height?: string | null
    title?: string | null
    caption?: string | null
  } & BlockStyleProps
}

export function MapBlockRenderer({ block }: MapBlockProps) {
  const { embedUrl, height, title, caption, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="px-6 max-w-[1440px] mx-auto">
      {title && <h2 className="text-3xl font-bold mb-6">{title}</h2>}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-white/5"
        style={{ height: height || '480px' }}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title || 'Map'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30 text-sm">
            Paste a Google Maps embed URL in the panel →
          </div>
        )}
      </div>
      {caption && <p className="text-sm opacity-40 mt-3 text-center">{caption}</p>}
    </BlockWrapper>
  )
}
