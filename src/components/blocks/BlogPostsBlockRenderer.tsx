'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  heroImage?: { url?: string | null; alt: string } | null
  author?: { name: string } | null
  destination?: { name: string } | null
  createdAt?: string | null
}

interface BlogPostsBlockProps {
  block: {
    title?: string | null
    posts?: BlogPost[] | null
    layout?: string | null
    ctaText?: string | null
    ctaLink?: string | null
  } & BlockStyleProps
}

export function BlogPostsBlockRenderer({ block }: BlogPostsBlockProps) {
  const { title, posts, layout, ctaText, ctaLink, ...styleProps } = block
  const items = posts ?? []
  const isGrid = layout !== 'list'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1440px] mx-auto px-6">
      <div className="flex items-end justify-between mb-8">
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
        {ctaText && ctaLink && (
          <Link href={ctaLink} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{ctaText} →</Link>
        )}
      </div>
      {isGrid ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((post) => (
            <Link key={post.id} href={`/stories/${post.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors bg-white/3">
              {post.heroImage?.url && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={post.heroImage.url} alt={post.heroImage.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs opacity-40 mb-2">
                  {post.destination?.name && <span>{post.destination.name}</span>}
                  {post.destination?.name && post.createdAt && <span>·</span>}
                  {post.createdAt && <span>{new Date(post.createdAt).toLocaleDateString()}</span>}
                </div>
                <h3 className="font-bold leading-snug mb-2 group-hover:opacity-80 transition-opacity">{post.title}</h3>
                {post.excerpt && <p className="text-sm opacity-50 leading-relaxed flex-1">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((post) => (
            <Link key={post.id} href={`/stories/${post.slug}`} className="group flex gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
              {post.heroImage?.url && (
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={post.heroImage.url} alt={post.heroImage.alt} fill className="object-cover" sizes="96px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold leading-snug truncate">{post.title}</h3>
                {post.excerpt && <p className="text-sm opacity-50 mt-1 line-clamp-1">{post.excerpt}</p>}
                <p className="text-xs opacity-30 mt-1">{post.author?.name}{post.destination?.name ? ` · ${post.destination.name}` : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </BlockWrapper>
  )
}
