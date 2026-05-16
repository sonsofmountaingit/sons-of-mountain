'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { mediaUrl } from '@/lib/media-url'

interface LightboxImage {
  image: { url?: string | null; width?: number | null; height?: number | null; alt?: string } | null
  caption?: string
}

interface GalleryLightboxProps {
  images: LightboxImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  photographerName?: string
}

export function GalleryLightbox({ images, currentIndex, onClose, onNavigate, photographerName }: GalleryLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(imgRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    gsap.fromTo(imgRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' })
  }, [currentIndex])

  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') onNavigate(Math.min(currentIndex + 1, images.length - 1))
      if (e.key === 'ArrowLeft') onNavigate(Math.max(currentIndex - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, images.length, handleClose, onNavigate])

  const img = images[currentIndex]
  const url = mediaUrl(img?.image?.url)

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors text-3xl leading-none w-10 h-10 flex items-center justify-center"
        aria-label="Close"
      >
        ×
      </button>

      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4">
        {url && (
          <img
            ref={imgRef}
            src={url}
            alt={img?.image?.alt ?? img?.caption ?? ''}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        )}

        <div className="flex items-center justify-between w-full text-sm">
          <div className="text-white/50">
            {img?.caption && <span>{img.caption}</span>}
            {photographerName && (
              <span className="ml-2 text-white/30">© {photographerName}</span>
            )}
          </div>
          <span className="text-white/30">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  )
}
