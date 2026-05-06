'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { StoryCard } from '@/components/ui/StoryCard'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface Story {
  id: string
  title: string
  slug: string
  heroImage: { url?: string | null; alt: string } | null
  author: { name: string; avatar?: { url?: string | null } | null }
  destination?: { name: string } | null
}

interface StoriesBlockProps {
  block: BlockStyleProps & {
    title?: string | null
    stories?: Story[] | null
    _stories?: Story[] | null
  }
}

export function StoriesBlockRenderer({ block }: StoriesBlockProps) {
  const stories = block.stories ?? block._stories ?? []
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <BlockWrapper props={{ ...block, overflow: block.overflow || 'hidden' }} noDefaultPadding={false}>
      <div className="flex items-center justify-between px-6 mb-8 max-w-[1440px] mx-auto">
        {block.title && <h2 className="text-3xl font-bold">{block.title}</h2>}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 flex items-center justify-center border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 flex items-center justify-center border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      <motion.div
        ref={scrollRef}
        className="flex gap-4 px-6 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' }}
        drag="x"
        dragConstraints={{ left: -(stories.length * 300), right: 0 }}
        dragElastic={0.1}
      >
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            title={story.title}
            slug={story.slug}
            heroImage={story.heroImage}
            author={story.author}
            destinationName={story.destination?.name}
          />
        ))}
      </motion.div>
    </BlockWrapper>
  )
}
