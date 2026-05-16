'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GalleryFilterBar } from '@/components/ui/GalleryFilterBar'
import { GalleryMasonry } from '@/components/ui/GalleryMasonry'
import { GalleryKeyboardHints } from '@/components/ui/GalleryKeyboardHints'
import { mediaUrl } from '@/lib/media-url'

type FilterMode = 'all' | 'date' | 'featured'

interface PhotographerStats {
  collections: number
  destinations: number
  trips: number
  programs: number
  photos: number
}

interface Props {
  collection: any
  photographerCollections: any[]
  photographerStats: PhotographerStats
}

const STAT_LABELS = [
  { key: 'collections', label: 'Галерии' },
  { key: 'destinations', label: 'Дестинации' },
  { key: 'trips', label: 'Пътувания' },
  { key: 'photos', label: 'Снимки' },
] as const

export function GalleryCollectionClient({ collection, photographerCollections, photographerStats }: Props) {
  const [filter, setFilter] = useState<FilterMode>('all')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'G' && !e.ctrlKey && !e.metaKey) { /* future: map toggle */ }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const photographer = typeof collection.photographer === 'object' ? collection.photographer : null
  const avatarUrl = mediaUrl(photographer?.profileImage?.url)
  const destinationName = typeof collection.destination === 'object' ? collection.destination?.name : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Collection header */}
      <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-16">
        {/* Destination label — highlighted pill */}
        {destinationName && (
          <div className="mb-6">
            <span className="bg-[#1a3a6b] text-white text-[11px] font-semibold tracking-[0.14em] uppercase px-2 py-1">
              Снимки от {destinationName}
            </span>
          </div>
        )}

        {/* Massive title */}
        <h1 className="font-black text-white leading-[1.02] tracking-[-0.01em] mb-8" style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}>
          {collection.title}
        </h1>

        {/* Description */}
        {collection.description && (
          <p className="text-white/65 text-[15px] md:text-base leading-[1.65] max-w-[640px] mb-10">
            {collection.description}
          </p>
        )}

        {/* Photographer — small avatar + stacked label/name */}
        {photographer && (
          <Link
            href={photographer.username ? `/photographers/${photographer.username}` : '#'}
            className="inline-flex items-center gap-3 group"
          >
            {avatarUrl ? (
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                <img src={avatarUrl} alt={photographer.name ?? ''} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-bold text-sm shrink-0">
                {(photographer.name ?? '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-white/40 text-[11px] leading-none mb-[5px]">Фотограф</p>
              <p className="text-white font-medium text-[15px] leading-none group-hover:text-white/70 transition-colors">
                {photographer.name}
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Filter bar + images */}
      <GalleryFilterBar filter={filter} onFilter={setFilter} slug={collection.slug} />

      <div className="w-full py-4">
        <GalleryMasonry
          images={collection.images ?? []}
          photographerName={photographer?.name}
          collectionId={String(collection.id)}
          filter={filter}
        />
      </div>

      {/* Photographer profile section */}
      {photographer && (
        <div className="border-t border-white/10 mt-10">
          <div className="max-w-[1100px] mx-auto px-6 py-10">
            {/* Avatar + info + stats in one row */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
              {/* Avatar */}
              <Link href={photographer.username ? `/photographers/${photographer.username}` : '#'} className="shrink-0">
                {avatarUrl ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>
                    <img src={avatarUrl} alt={photographer.name ?? ''} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-bold text-xl">
                    {(photographer.name ?? '?')[0].toUpperCase()}
                  </div>
                )}
              </Link>

              {/* Name + instagram + bio */}
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-[11px] tracking-widest uppercase mb-1">Фотограф</p>
                <Link
                  href={photographer.username ? `/photographers/${photographer.username}` : '#'}
                  className="text-white font-bold text-lg hover:text-white/70 transition-colors block leading-tight"
                >
                  {photographer.name}
                </Link>
                {photographer.instagramHandle && (
                  <a
                    href={`https://instagram.com/${photographer.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-white/70 text-xs transition-colors"
                  >
                    {photographer.instagramHandle}
                  </a>
                )}
                {photographer.bio && (
                  <p className="text-white/45 text-xs mt-1.5 max-w-sm leading-relaxed">{photographer.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-2 shrink-0">
                {STAT_LABELS.map(({ key, label }) => (
                  <div key={key} className="bg-white/5 rounded-lg px-4 py-3 text-center min-w-[72px]">
                    <p className="text-xl font-bold text-white leading-none mb-1">{photographerStats[key]}</p>
                    <p className="text-white/40 text-[10px] tracking-wider uppercase">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Other collections by this photographer */}
            {photographerCollections.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-base">Още галерии от {photographer.name}</h2>
                  {photographer.username && (
                    <Link
                      href={`/photographers/${photographer.username}`}
                      className="text-white/40 hover:text-white text-xs transition-colors"
                    >
                      Виж всички →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {photographerCollections.map((col: any) => {
                    const coverUrl = mediaUrl(col.coverImage?.url)
                    return (
                      <Link key={col.id} href={`/gallery/${col.slug}`} className="group block">
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-1.5">
                          {coverUrl && (
                            <img
                              src={coverUrl}
                              alt={col.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <p className="text-white/60 text-[11px] font-medium line-clamp-2 text-center group-hover:text-white transition-colors">
                          {col.title}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <GalleryKeyboardHints />
    </div>
  )
}
