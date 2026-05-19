'use client'

import Image from 'next/image'
import { useState } from 'react'

interface GalleryItem {
  image: { url: string; alt?: string }
  alt?: string
}

interface Props {
  gallery: GalleryItem[]
  name: string
}

export function AccommodationCarousel({ gallery, name }: Props) {
  const [idx, setIdx] = useState(0)
  if (!gallery.length) return null
  const item = gallery[idx]

  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
      <Image
        src={item.image.url}
        alt={item.alt ?? item.image.alt ?? name}
        fill
        loading="lazy"
        quality={80}
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {gallery.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + gallery.length) % gallery.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-lg"
            aria-label="Предишна снимка"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % gallery.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-lg"
            aria-label="Следваща снимка"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors`}
                aria-label={`Снимка ${i + 1}`}
              >
                <span className={`block w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
