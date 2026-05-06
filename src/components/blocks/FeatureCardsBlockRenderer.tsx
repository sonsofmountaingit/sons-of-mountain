'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface FeatureCard {
  imageUrl?: string | null
  heading: string
  text?: string | null
  ctaText?: string | null
  ctaLink?: string | null
}

interface FeatureCardsBlockProps {
  block: { title?: string | null; cards: FeatureCard[]; columns?: string | null } & BlockStyleProps
}

export function FeatureCardsBlockRenderer({ block }: FeatureCardsBlockProps) {
  const { title, cards, columns, ...styleProps } = block
  const cols = parseInt(columns || '3')
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-10 text-center">{title}</h2>}
      <div className={`grid grid-cols-1 gap-6 ${gridClass}`}>
        {cards.map((card, i) => (
          <div key={i} className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/3 hover:bg-white/8 transition-colors group">
            {card.imageUrl && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={card.imageUrl} alt={card.heading} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg mb-2">{card.heading}</h3>
              {card.text && <p className="text-sm opacity-60 leading-relaxed flex-1 mb-4">{card.text}</p>}
              {card.ctaText && card.ctaLink && (
                <Link href={card.ctaLink} className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">
                  {card.ctaText} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
