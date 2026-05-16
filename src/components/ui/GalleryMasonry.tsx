'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GalleryLightbox } from './GalleryLightbox'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

interface GalleryImage {
  image: { url?: string | null; width?: number | null | undefined; height?: number | null | undefined; alt?: string } | null
  caption?: string
  featured?: boolean
  takenAt?: string
  dominantColors?: { hex: string }[]
}

type FilterMode = 'all' | 'date' | 'featured'

interface GalleryMasonryProps {
  images: GalleryImage[]
  photographerName?: string
  collectionId: string
  filter: FilterMode
}

const PAGE_SIZE = 12

/**
 * Assigns each image to a column in a panicframe-style editorial layout:
 * Row of 3 equal columns, then a wide+narrow split, repeating.
 * The actual heights adapt to each image's natural aspect ratio.
 */
function buildRows(images: GalleryImage[]): GalleryImage[][] {
  const rows: GalleryImage[][] = []
  let i = 0
  let rowNum = 0
  while (i < images.length) {
    if (rowNum % 2 === 0) {
      // 3-column equal row
      rows.push(images.slice(i, i + 3))
      i += 3
    } else {
      // 2-column row: first image is wide (takes 2/3), second is narrow (1/3)
      // OR just 1 image spanning full width
      const chunk = images.slice(i, i + 2)
      rows.push(chunk)
      i += chunk.length
    }
    rowNum++
  }
  return rows
}

function aspectRatio(img: GalleryImage): number {
  const w = img.image?.width ?? 4
  const h = img.image?.height ?? 3
  return (w || 4) / (h || 3)
}

export function GalleryMasonry({ images, photographerName, collectionId, filter }: GalleryMasonryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerReachedRef = useRef(false)

  const sorted = filter === 'date'
    ? [...images].sort((a, b) => (b.takenAt ?? '').localeCompare(a.takenAt ?? ''))
    : filter === 'featured'
    ? images.filter((i) => i.featured)
    : images

  const visible = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length
  const rows = buildRows(visible)

  useEffect(() => {
    if (!gridRef.current) return
    const items = gridRef.current.querySelectorAll<HTMLElement>('[data-gi]')
    gsap.fromTo(items, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0,
      duration: 0.55,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
    })
  }, [filter, visibleCount])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !footerReachedRef.current) {
        setVisibleCount((n) => n + PAGE_SIZE)
      }
    }, { rootMargin: '400px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver((entries) => {
      footerReachedRef.current = entries[0].isIntersecting
    }, { rootMargin: '-400px 0px 0px 0px' })
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  // flat index lookup for lightbox
  const flatIndex = (rowIdx: number, colIdx: number) => {
    let count = 0
    for (let r = 0; r < rowIdx; r++) count += rows[r].length
    return count + colIdx
  }

  return (
    <div>
      <div ref={gridRef} className="flex flex-col gap-[3px] w-screen -mx-0">
        {rows.map((row, rowIdx) => {
          const is3col = row.length === 3
          const is2col = row.length === 2
          const is1col = row.length === 1

          if (is3col) {
            return (
              <div key={rowIdx} className="flex gap-[3px]" style={{ height: '100vh' }}>
                {row.map((img, colIdx) => {
                  const url = mediaUrl(img.image?.url)
                  const idx = flatIndex(rowIdx, colIdx)
                  return (
                    <div
                      key={colIdx}
                      data-gi
                      className="relative flex-1 overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      {url && (
                        <img
                          src={url}
                          alt={img.image?.alt ?? img.caption ?? ''}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          loading={idx < 6 ? 'eager' : 'lazy'}
                        />
                      )}
                      <div className="absolute bottom-2 left-3 text-white/40 text-xs select-none">
                        @{photographerName}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          if (is2col) {
            return (
              <div key={rowIdx} className="flex gap-[3px]" style={{ height: '100vh' }}>
                {row.map((img, colIdx) => {
                  const url = mediaUrl(img.image?.url)
                  const idx = flatIndex(rowIdx, colIdx)
                  const flex = colIdx === 0 ? '0 0 70%' : '1 1 0'
                  return (
                    <div
                      key={colIdx}
                      data-gi
                      className="relative overflow-hidden cursor-pointer group"
                      style={{ flex }}
                      onClick={() => setLightboxIndex(idx)}
                    >
                      {url && (
                        <img
                          src={url}
                          alt={img.image?.alt ?? img.caption ?? ''}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          loading={idx < 6 ? 'eager' : 'lazy'}
                        />
                      )}
                      <div className="absolute bottom-2 left-3 text-white/40 text-xs select-none">
                        @{photographerName}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          // Single full-width image
          if (is1col) {
            const img = row[0]
            const url = mediaUrl(img.image?.url)
            const idx = flatIndex(rowIdx, 0)
            return (
              <div key={rowIdx} data-gi className="relative overflow-hidden cursor-pointer group" style={{ height: '100vh' }} onClick={() => setLightboxIndex(idx)}>
                {url && (
                  <img
                    src={url}
                    alt={img.image?.alt ?? img.caption ?? ''}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading={idx < 6 ? 'eager' : 'lazy'}
                  />
                )}
                <div className="absolute bottom-2 left-3 text-white/40 text-xs select-none">
                  @{photographerName}
                </div>
              </div>
            )
          }

          return null
        })}
      </div>

      {hasMore && <div ref={sentinelRef} className="h-4" />}
      {hasMore && (
        <div className="flex justify-center py-8">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={sorted}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          photographerName={photographerName}
        />
      )}
    </div>
  )
}
