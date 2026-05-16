'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion } from 'motion/react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'
import { mediaUrl } from '@/lib/media-url'

interface GalleryImage {
  image: { url?: string | null; alt: string } | null
  caption?: string | null
}

interface ImageGalleryProps {
  block: {
    title?: string | null
    images: GalleryImage[]
    layout?: string | null
  } & BlockStyleProps
}

export function ImageGalleryRenderer({ block }: ImageGalleryProps) {
  const { title, images, layout, ...styleProps } = block
  const scrollRef = useRef<HTMLDivElement>(null)

  if (layout === 'grid') {
    return (
      <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
        {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((item, i) =>
            mediaUrl(item.image?.url) ? (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={mediaUrl(item.image!.url)!}
                  alt={item.image!.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ) : null
          )}
        </div>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper props={styleProps} noDefaultPadding>
      <div className="py-16">
        {title && (
          <h2 className="text-3xl font-bold px-6 mb-8 max-w-[1440px] mx-auto">{title}</h2>
        )}
        <motion.div
          ref={scrollRef}
          className="flex gap-3 px-6 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
          drag="x"
          dragConstraints={{ left: -(images.length * 220), right: 0 }}
          dragElastic={0.1}
        >
          {images.map((item, i) =>
            mediaUrl(item.image?.url) ? (
              <div key={i} className="relative flex-shrink-0 w-52 aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={mediaUrl(item.image!.url)!}
                  alt={item.image!.alt}
                  fill
                  className="object-cover"
                  sizes="208px"
                />
              </div>
            ) : null
          )}
        </motion.div>
      </div>
    </BlockWrapper>
  )
}
