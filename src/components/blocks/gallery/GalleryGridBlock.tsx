'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

interface GalleryImage {
  image: { url?: string | null; width?: number; height?: number; alt?: string } | null
  caption?: string
}

interface Photographer {
  name?: string
  username?: string
  profileImage?: { url?: string | null } | null
  instagramHandle?: string
}

interface GalleryCollection {
  id: string
  title: string
  slug: string
  description?: string
  coverImage?: { url?: string | null; width?: number; height?: number } | null
  photographer?: Photographer | null
  images?: GalleryImage[]
}

interface GalleryGridBlockProps {
  collections: GalleryCollection[]
}

function CollectionCard({ collection, index }: { collection: GalleryCollection; index: number }) {
  const [imgIndex, setImgIndex] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const cardRef = useRef<HTMLAnchorElement>(null)

  const coverUrl = mediaUrl(collection.coverImage?.url)
  const allImages = [
    collection.coverImage ? { url: coverUrl } : null,
    ...(collection.images ?? []).map((i) => ({ url: mediaUrl(i.image?.url) })),
  ].filter(Boolean) as { url: string | null }[]

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: index * 0.08,
      scrollTrigger: { trigger: cardRef.current, start: 'top 90%', once: true },
    })
  }, [index])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (allImages.length <= 1) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const newIndex = Math.min(Math.floor(x * allImages.length), allImages.length - 1)
    if (newIndex !== imgIndex) {
      gsap.to(imgRef.current, {
        opacity: 0, duration: 0.08,
        onComplete: () => {
          setImgIndex(newIndex)
          gsap.to(imgRef.current, { opacity: 1, duration: 0.18 })
        },
      })
    }
  }, [imgIndex, allImages.length])

  const handleMouseLeave = useCallback(() => {
    gsap.to(imgRef.current, {
      opacity: 0, duration: 0.12,
      onComplete: () => {
        setImgIndex(0)
        gsap.to(imgRef.current, { opacity: 1, duration: 0.2 })
      },
    })
  }, [])

  const currentUrl = allImages[imgIndex]?.url ?? coverUrl
  const photographer = collection.photographer
  const avatarUrl = mediaUrl(photographer?.profileImage?.url)

  return (
    <Link
      ref={cardRef}
      href={`/gallery/${collection.slug}`}
      className="group block opacity-0"
      style={{ textDecoration: 'none' }}
    >
      {/* Image card — square with rounded corners */}
      <div
        className="relative rounded-2xl overflow-hidden bg-white/5 cursor-pointer"
        style={{ aspectRatio: '1/1' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {currentUrl && (
          <img
            ref={imgRef}
            src={currentUrl}
            alt={collection.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading={index < 4 ? 'eager' : 'lazy'}
          />
        )}

        {/* Subtle bottom gradient for avatar legibility */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Photographer avatar — bottom right inside card */}
        {avatarUrl && (
          <div className="absolute bottom-3 right-3 w-11 h-11 rounded-full overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.4)' }}>
            <img src={avatarUrl} alt={photographer?.name ?? ''} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Hover: slight white overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300" />
      </div>

      {/* Title + photographer below card — centered */}
      <div className="pt-4 pb-2 text-center">
        <h3 className="text-white font-bold text-xl md:text-2xl leading-tight line-clamp-3 mb-2">
          {collection.title}
        </h3>
        {photographer?.name && (
          <p className="text-white/40 text-sm font-normal">{photographer.name}</p>
        )}
      </div>
    </Link>
  )
}

export function GalleryGridBlock({ collections }: GalleryGridBlockProps) {
  return (
    <div className="px-6 pb-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {collections.map((col, i) => (
            <CollectionCard key={col.id} collection={col} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
