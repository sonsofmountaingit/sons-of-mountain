'use client'

import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface SeparatorBlockProps {
  block: {
    label?: string | null
    style?: string | null
  } & BlockStyleProps
}

export function SeparatorBlockRenderer({ block }: SeparatorBlockProps) {
  const { label, style: lineStyle, ...styleProps } = block
  return (
    <BlockWrapper
      props={{ ...styleProps, paddingTop: styleProps.paddingTop || '2rem', paddingBottom: styleProps.paddingBottom || '2rem' }}
      noDefaultPadding
      innerClassName="px-6 max-w-[1440px] mx-auto"
    >
      {label ? (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-current opacity-10" />
          <span className="text-xs font-semibold tracking-widest uppercase opacity-30">{label}</span>
          <div className="flex-1 h-px bg-current opacity-10" />
        </div>
      ) : lineStyle === 'dots' ? (
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-20" />)}
        </div>
      ) : (
        <div className="h-px bg-current opacity-10" />
      )}
    </BlockWrapper>
  )
}
