'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { DestinationCard } from '@/components/ui/DestinationCard'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface Destination {
  id: string
  name: string
  slug: string
  heroImage: { url?: string | null; alt: string } | null
}

interface DestinationCarouselProps {
  block: {
    title?: string | null
    destinations?: Destination[] | null
  } & BlockStyleProps
}

export function DestinationCarouselRenderer({ block }: DestinationCarouselProps) {
  const { title, destinations, ...styleProps } = block
  const items = destinations ?? []
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <BlockWrapper props={styleProps} noDefaultPadding>
      <div className="py-16">
        {title && (
          <h2 className="text-3xl font-bold px-6 mb-8 max-w-[1440px] mx-auto">{title}</h2>
        )}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 border border-white/20 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Scroll left"
          >
            ←
          </button>
          <motion.div
            ref={scrollRef}
            className="flex gap-4 px-16 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none' }}
            drag="x"
            dragConstraints={{ left: -(items.length * 300), right: 0 }}
            dragElastic={0.1}
          >
            {items.map((dest) => (
              <DestinationCard
                key={dest.id}
                name={dest.name}
                slug={dest.slug}
                heroImage={dest.heroImage}
              />
            ))}
          </motion.div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 border border-white/20 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
    </BlockWrapper>
  )
}
