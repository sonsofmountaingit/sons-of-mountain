'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface FAQItem {
  question: string
  answer: unknown
}

interface FAQBlockProps {
  block: BlockStyleProps & {
    title?: string | null
    items: FAQItem[]
  }
}

export function FAQBlockRenderer({ block }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <BlockWrapper props={block} innerClassName="max-w-3xl mx-auto">
      {block.title && (
        <h2 className="text-3xl font-bold mb-10">{block.title}</h2>
      )}
      <div className="space-y-2">
        {block.items.map((item, i) => (
          <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.question}
              <motion.span
                animate={{ rotate: openIndex === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 ml-4 text-white/50"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sm text-white/60 prose prose-invert max-w-none">
                    <RichText data={item.answer as Parameters<typeof RichText>[0]['data']} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
