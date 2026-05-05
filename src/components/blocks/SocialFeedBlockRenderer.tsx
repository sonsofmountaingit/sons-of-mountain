'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface SocialPost {
  platform: string
  handle: string
  content: string
  imageUrl?: string | null
  likes?: string | null
  url?: string | null
  date?: string | null
}

interface SocialFeedBlockProps {
  block: {
    title?: string | null
    posts?: SocialPost[] | null
    columns?: string | null
  } & BlockStyleProps
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  twitter: '#1DA1F2',
  x: '#000000',
  facebook: '#1877F2',
  tiktok: '#010101',
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'IG',
  twitter: 'X',
  x: 'X',
  facebook: 'fb',
  tiktok: 'TT',
}

export function SocialFeedBlockRenderer({ block }: SocialFeedBlockProps) {
  const { title, posts, columns, ...styleProps } = block
  const items = posts ?? []
  const cols = parseInt(columns || '3')
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
      <div className={`grid grid-cols-1 gap-4 ${gridClass}`}>
        {items.map((post, i) => {
          const platformKey = post.platform?.toLowerCase() || 'instagram'
          const color = PLATFORM_COLORS[platformKey] || '#888'
          const icon = PLATFORM_ICONS[platformKey] || platformKey.slice(0, 2).toUpperCase()
          const card = (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden flex flex-col group hover:border-white/20 transition-colors">
              {post.imageUrl && (
                <div className="relative aspect-square overflow-hidden">
                  <Image src={post.imageUrl} alt={post.content.slice(0, 40)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{icon}</span>
                  <span className="text-xs opacity-50">@{post.handle}</span>
                  {post.date && <span className="text-xs opacity-30 ml-auto">{new Date(post.date).toLocaleDateString()}</span>}
                </div>
                <p className="text-sm opacity-80 leading-relaxed line-clamp-4 flex-1">{post.content}</p>
                {post.likes && (
                  <p className="text-xs opacity-40">♥ {post.likes}</p>
                )}
              </div>
            </div>
          )
          return post.url ? <Link key={i} href={post.url} target="_blank" rel="noopener noreferrer">{card}</Link> : card
        })}
      </div>
    </BlockWrapper>
  )
}
