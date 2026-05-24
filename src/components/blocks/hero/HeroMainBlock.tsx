'use client'

import React from 'react'
import { DropZone } from '@puckeditor/core'

interface HeroMainBlockProps {
  backgroundVideoUrl?: string
  overlayOpacity?: number
  contentAlign?: string
  height?: string
  children?: React.ReactNode
}

const alignClass: Record<string, string> = {
  center: 'items-center justify-center text-center',
  'bottom-center': 'items-center justify-end pb-72 md:pb-80 text-center',
  'bottom-left': 'items-start justify-end pb-72 md:pb-80 text-left',
}

const heightStyle: Record<string, string> = {
  screen: '100vh',
  '80vh': '80vh',
  '60vh': '60vh',
}

export function HeroMainBlock({
  backgroundVideoUrl = '/hero-bg.mp4',
  overlayOpacity = 40,
  contentAlign = 'bottom-center',
  height = 'screen',
  children,
}: HeroMainBlockProps) {
  const align = alignClass[contentAlign] ?? alignClass['bottom-center']
  const sectionHeight = heightStyle[height] ?? '100vh'
  const opacity = Math.min(100, Math.max(0, overlayOpacity ?? 40)) / 100

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]" style={{ height: sectionHeight }}>
      {backgroundVideoUrl && (
        <video
          src={backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />

      <div className={`absolute inset-0 z-10 flex flex-col px-8 md:px-16 ${align}`}>
        <div className="max-w-4xl w-full">
          {children ?? <DropZone zone="hero-content" />}
        </div>
      </div>
    </section>
  )
}
