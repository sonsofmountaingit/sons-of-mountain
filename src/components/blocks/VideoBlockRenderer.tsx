'use client'

import { useRef, useState } from 'react'

interface VideoBlockProps {
  block: {
    url: string
    poster?: { url?: string | null; alt: string } | null
    caption?: string | null
    autoPlay?: boolean | null
    muted?: boolean | null
    bgColor?: string | null
    textColor?: string | null
    paddingTop?: string | null
    paddingBottom?: string | null
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

  return (
    <section
      className="px-6"
      style={{
        backgroundColor: block.bgColor || undefined,
        color: block.textColor || undefined,
        paddingTop: block.paddingTop ?? '4rem',
        paddingBottom: block.paddingBottom ?? '4rem',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            src={block.url}
            autoPlay={block.autoPlay ?? false}
            muted={block.muted ?? true}
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={block.poster?.url ?? undefined}
          />
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
        </div>
        {block.caption && (
          <p className="text-sm text-white/40 mt-3 text-center">{block.caption}</p>
        )}
      </div>
    </section>
  )
}
