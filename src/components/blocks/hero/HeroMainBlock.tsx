'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'

interface HeroMainBlockProps {
  headline?: string
  subtext?: string
  ctaLabel?: string
  ctaUrl?: string
  backgroundImageUrl?: string
}

export function HeroMainBlock({
  headline = 'Преоткривай света с нас!',
  subtext = 'Пътувай с Panic Frame там, където комфортът среща приключението.',
  ctaLabel = 'Виж всички дестинации',
  ctaUrl = '/destinations',
  backgroundImageUrl = '',
}: HeroMainBlockProps) {
  const words = headline.split(' ')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt="Hero background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: words.length * 0.08 + 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto"
        >
          {subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: words.length * 0.08 + 0.4, duration: 0.6 }}
        >
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/90 transition-colors"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
