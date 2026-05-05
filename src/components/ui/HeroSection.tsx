'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { wordAnimation, staggerContainer } from '@/lib/animations'

const HEADLINE = 'Преоткривай света с нас!'

export function HeroSection() {
  const words = HEADLINE.split(' ')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            {words.map((word, i) => (
              <motion.span key={i} custom={i} variants={wordAnimation} className="inline-block mr-[0.25em]">
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: words.length * 0.1 + 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
        >
          Пътувай с Panic Frame там, където комфортът среща приключението.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: words.length * 0.1 + 0.4, duration: 0.6 }}
        >
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors"
          >
            Виж всички дестинации →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
