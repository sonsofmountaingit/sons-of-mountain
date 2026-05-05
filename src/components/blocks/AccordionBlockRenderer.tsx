'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface AccordionItem {
  title: string
  content: string
}

interface AccordionBlockProps {
  block: { heading?: string | null; items: AccordionItem[] } & BlockStyleProps
}

export function AccordionBlockRenderer({ block }: AccordionBlockProps) {
  const { heading, items, ...styleProps } = block
  const [open, setOpen] = useState<number | null>(null)

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-3xl mx-auto px-6">
      {heading && <h2 className="text-3xl font-bold mb-8">{heading}</h2>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium hover:bg-white/5 transition-colors"
            >
              <span>{item.title}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="opacity-50 text-lg ml-4 shrink-0">+</motion.span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sm opacity-60 leading-relaxed whitespace-pre-wrap">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
