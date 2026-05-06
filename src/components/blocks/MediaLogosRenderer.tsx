'use client'

import Image from 'next/image'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface Logo {
  name: string
  image: { url?: string | null; alt: string } | null
  url?: string | null
}

interface MediaLogosProps {
  block: {
    title?: string | null
    logos: Logo[]
  } & BlockStyleProps
}

export function MediaLogosRenderer({ block }: MediaLogosProps) {
  const { title, logos, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      {title && (
        <p className="text-xs font-semibold tracking-widest opacity-30 uppercase text-center mb-8">
          {title}
        </p>
      )}
      <div className="flex items-center justify-center gap-10 flex-wrap">
        {logos.map((logo, i) =>
          logo.image?.url ? (
            logo.url ? (
              <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Image src={logo.image.url} alt={logo.image.alt || logo.name} width={80} height={40} className="h-8 w-auto object-contain" />
              </a>
            ) : (
              <div key={i} className="opacity-50">
                <Image src={logo.image.url} alt={logo.image.alt || logo.name} width={80} height={40} className="h-8 w-auto object-contain" />
              </div>
            )
          ) : null
        )}
      </div>
    </BlockWrapper>
  )
}
