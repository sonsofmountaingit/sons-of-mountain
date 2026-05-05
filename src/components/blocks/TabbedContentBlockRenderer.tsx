'use client'

import { useState } from 'react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface Tab {
  label: string
  content: string
}

interface TabbedContentBlockProps {
  block: { title?: string | null; tabs: Tab[] } & BlockStyleProps
}

export function TabbedContentBlockRenderer({ block }: TabbedContentBlockProps) {
  const { title, tabs, ...styleProps } = block
  const [active, setActive] = useState(0)

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-3xl mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-8 flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === active ? 'bg-white text-black' : 'opacity-60 hover:opacity-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs[active] && (
        <div className="prose prose-invert max-w-none text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
          {tabs[active].content}
        </div>
      )}
    </BlockWrapper>
  )
}
