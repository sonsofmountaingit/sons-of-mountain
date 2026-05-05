'use client'

import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface PricingTier {
  name: string
  price: string
  period?: string | null
  description?: string | null
  features: string[]
  highlighted?: boolean
  ctaText?: string | null
  ctaLink?: string | null
}

interface PricingBlockProps {
  block: { title?: string | null; tiers: PricingTier[] } & BlockStyleProps
}

export function PricingBlockRenderer({ block }: PricingBlockProps) {
  const { title, tiers, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1200px] mx-auto px-6">
      {title && <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>}
      <div className={`grid gap-6 ${tiers.length === 2 ? 'md:grid-cols-2' : tiers.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`relative rounded-2xl p-8 flex flex-col ${tier.highlighted
              ? 'bg-white text-black ring-2 ring-white scale-105 shadow-2xl z-10'
              : 'bg-white/5 border border-white/10'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold tracking-wider px-4 py-1 rounded-full uppercase">
                Most Popular
              </div>
            )}
            <p className="text-sm font-semibold tracking-widest uppercase opacity-60 mb-2">{tier.name}</p>
            <div className="mb-2">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.period && <span className="text-sm opacity-50 ml-1">/{tier.period}</span>}
            </div>
            {tier.description && <p className="text-sm opacity-60 mb-6 leading-relaxed">{tier.description}</p>}
            <ul className="space-y-3 flex-1 mb-8">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span className={tier.highlighted ? 'text-green-600' : 'text-green-400'}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {tier.ctaText && tier.ctaLink && (
              <Link
                href={tier.ctaLink}
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${tier.highlighted
                  ? 'bg-black text-white hover:bg-black/80'
                  : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {tier.ctaText}
              </Link>
            )}
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
