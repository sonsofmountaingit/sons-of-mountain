import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface IconGridItem {
  icon: string
  heading: string
  description?: string | null
  link?: string | null
}

interface IconGridBlockProps {
  block: { title?: string | null; items: IconGridItem[]; columns?: string | null } & BlockStyleProps
}

export function IconGridBlockRenderer({ block }: IconGridBlockProps) {
  const { title, items, columns, ...styleProps } = block
  const cols = parseInt(columns || '3')
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : cols === 5 ? 'md:grid-cols-3 lg:grid-cols-5' : 'md:grid-cols-3'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1200px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-10 text-center">{title}</h2>}
      <div className={`grid grid-cols-1 gap-6 ${gridClass}`}>
        {items.map((item, i) => {
          const inner = (
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors h-full">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.heading}</h3>
              {item.description && <p className="text-sm opacity-60 leading-relaxed">{item.description}</p>}
            </div>
          )
          return item.link ? (
            <Link key={i} href={item.link} className="block">{inner}</Link>
          ) : (
            <div key={i}>{inner}</div>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
