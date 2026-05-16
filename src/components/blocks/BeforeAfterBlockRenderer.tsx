'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'
import { mediaUrl } from '@/lib/media-url'

interface BeforeAfterBlockProps {
  block: {
    beforeImageUrl: string
    afterImageUrl: string
    beforeLabel?: string | null
    afterLabel?: string | null
    title?: string | null
    caption?: string | null
  } & BlockStyleProps
}

export function BeforeAfterBlockRenderer({ block }: BeforeAfterBlockProps) {
  const { beforeImageUrl, afterImageUrl, beforeLabel, afterLabel, title, caption, ...styleProps } = block
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPosition(x)
  }

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-4xl mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>}
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-2xl aspect-video cursor-ew-resize"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {afterImageUrl && (
          <div className="absolute inset-0">
            <Image src={mediaUrl(afterImageUrl) ?? afterImageUrl} alt={afterLabel || 'After'} fill className="object-cover" sizes="900px" />
          </div>
        )}
        {beforeImageUrl && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
            <Image src={mediaUrl(beforeImageUrl) ?? beforeImageUrl} alt={beforeLabel || 'Before'} fill className="object-cover" sizes="900px" />
          </div>
        )}
        {/* Divider */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
              <path d="M7 16l-4-4 4-4M17 8l4 4-4 4" />
            </svg>
          </div>
        </div>
        {beforeLabel && <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">{beforeLabel}</div>}
        {afterLabel && <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">{afterLabel}</div>}
      </div>
      {caption && <p className="text-sm opacity-40 mt-3 text-center">{caption}</p>}
    </BlockWrapper>
  )
}
