'use client'

import Image from 'next/image'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface TimelineEvent {
  year: string
  title: string
  description?: string | null
  imageUrl?: string | null
}

interface TimelineBlockProps {
  block: { title?: string | null; events: TimelineEvent[] } & BlockStyleProps
}

export function TimelineBlockRenderer({ block }: TimelineBlockProps) {
  const { title, events, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-3xl mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-12 text-center">{title}</h2>}
      <div className="relative">
        <div className="absolute left-[calc(theme(spacing.16)_+_1px)] top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-10">
          {events.map((event, i) => (
            <div key={i} className="flex gap-8">
              <div className="w-16 shrink-0 text-right">
                <span className="text-sm font-bold opacity-40">{event.year}</span>
              </div>
              <div className="relative">
                <div className="absolute -left-[calc(theme(spacing.8)_+_1px)] top-1.5 w-3 h-3 rounded-full bg-white/30 border border-white/60" />
                <div className="pb-2">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  {event.description && <p className="text-sm opacity-60 leading-relaxed">{event.description}</p>}
                  {event.imageUrl && (
                    <div className="relative mt-3 rounded-lg overflow-hidden aspect-video max-w-sm">
                      <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="400px" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BlockWrapper>
  )
}
