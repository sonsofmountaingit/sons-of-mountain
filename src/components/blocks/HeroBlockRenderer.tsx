'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { wordAnimation, staggerContainer } from '@/lib/animations'

interface HeroBlockProps {
  block: {
    headline: string
    subheadline?: string | null
    ctaText?: string | null
    ctaLink?: string | null
    backgroundImage?: { url?: string | null; alt: string } | null
    variant?: string | null
    bgColor?: string | null
    textColor?: string | null
  }
}

export function HeroBlockRenderer({ block }: HeroBlockProps) {
  const words = String(block.headline ?? '').split(' ')

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: block.bgColor ?? '#0a0a0a' }}
    >
      {block.backgroundImage?.url && (
        <Image
          src={block.backgroundImage.url}
          alt={block.backgroundImage.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="overflow-hidden"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6" style={{ color: block.textColor ?? '#ffffff' }}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={wordAnimation}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {block.subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: words.length * 0.1 + 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto"
          >
            {block.subheadline}
          </motion.p>
        )}

        {block.ctaText && block.ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: words.length * 0.1 + 0.4, duration: 0.6 }}
          >
            <Link
              href={block.ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors"
            >
              {block.ctaText}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
