'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface GalleryImage {
  url: string
  alt: string
  caption?: string | null
}

interface GalleryLightboxBlockProps {
  block: { title?: string | null; images: GalleryImage[]; columns?: string | null } & BlockStyleProps
}

export function GalleryLightboxBlockRenderer({ block }: GalleryLightboxBlockProps) {
  const { title, images, columns, ...styleProps } = block
  const [lightbox, setLightbox] = useState<number | null>(null)
  const cols = parseInt(columns || '3')
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : cols === 5 ? 'md:grid-cols-3 lg:grid-cols-5' : 'md:grid-cols-3'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
      <div className={`grid grid-cols-2 gap-2 ${gridClass}`}>
        {images.map((img, i) => (
          <button key={i} onClick={() => setLightbox(i)} className="relative aspect-square rounded-lg overflow-hidden group">
            <Image src={img.url} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl z-10">×</button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-2xl z-10 p-2"
              onClick={(e) => { e.stopPropagation(); setLightbox((l) => l !== null ? Math.max(0, l - 1) : 0) }}>‹</button>
            <button className="absolute right-14 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-2xl z-10 p-2"
              onClick={(e) => { e.stopPropagation(); setLightbox((l) => l !== null ? Math.min(images.length - 1, l + 1) : 0) }}>›</button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[lightbox].url} alt={images[lightbox].alt} fill className="object-contain" sizes="1200px" />
            </motion.div>
            {images[lightbox]?.caption && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/50">{images[lightbox].caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BlockWrapper>
  )
}
