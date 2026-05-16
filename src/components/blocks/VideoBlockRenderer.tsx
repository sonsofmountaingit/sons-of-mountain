'use client'

import { useRef, useState } from 'react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface VideoBlockProps {
  block: BlockStyleProps & {
    url: string
    poster?: { url?: string | null; alt: string } | null
    posterImage?: string | null
    caption?: string | null
    autoPlay?: boolean | null
    muted?: boolean | null
    loop?: boolean | null
    controls?: boolean | null
  }
}

export function VideoBlockRenderer({ block }: VideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(block.autoPlay ?? false)

  function toggle() {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const posterUrl = block.posterImage || block.poster?.url || undefined

  return (
    <BlockWrapper props={block} innerClassName="max-w-4xl mx-auto">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          src={block.url}
          autoPlay={block.autoPlay ?? false}
          muted={block.muted ?? true}
          loop={block.loop ?? true}
          controls={block.controls ?? false}
          playsInline
          preload={block.autoPlay ? 'auto' : 'none'}
          className="w-full h-full object-cover"
          poster={posterUrl}
        />
        {!(block.controls ?? false) && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </div>
          </button>
        )}
      </div>
      {block.caption && (
        <p className="text-sm text-white/40 mt-3 text-center">{block.caption}</p>
      )}
    </BlockWrapper>
  )
}
