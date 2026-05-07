'use client'

import { motion } from 'motion/react'

interface HeroHeadlineBlockProps {
  text?: string
  fontSize?: string
  color?: string
  fontWeight?: string
  textAlign?: string
}

export function HeroHeadlineBlock({
  text = 'Преоткривай света с нас!',
  fontSize = '4rem',
  color = '#ffffff',
  fontWeight = '700',
  textAlign = 'center',
}: HeroHeadlineBlockProps) {
  const str = typeof text === 'string' ? text : String(text ?? '')
  const words = str.split(' ')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      style={{ textAlign: textAlign as any }}
      className="w-full"
    >
      <h1 style={{ fontSize, color, fontWeight, lineHeight: 1.15, marginBottom: '0.5rem' }}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
    </motion.div>
  )
}
