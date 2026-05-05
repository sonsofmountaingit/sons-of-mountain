'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { DestinationCard } from './DestinationCard'

interface Destination {
  id: string
  name: string
  slug: string
  heroImage: { url?: string | null; alt: string } | null
}

export function DestinationCarouselSection({ destinations }: { destinations: Destination[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <section className="py-16 overflow-hidden">
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 border border-white/20 rounded-full text-white hover:bg-black/80 transition-colors" aria-label="Scroll left">←</button>
        <motion.div
          ref={scrollRef}
          className="flex gap-4 px-16 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
          drag="x"
          dragConstraints={{ left: -(destinations.length * 300), right: 0 }}
          dragElastic={0.1}
        >
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} name={dest.name} slug={dest.slug} heroImage={dest.heroImage} />
          ))}
        </motion.div>
        <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 border border-white/20 rounded-full text-white hover:bg-black/80 transition-colors" aria-label="Scroll right">→</button>
      </div>
    </section>
  )
}
