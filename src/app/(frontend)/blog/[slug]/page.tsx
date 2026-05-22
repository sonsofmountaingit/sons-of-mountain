import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { mediaUrl } from '@/lib/media-url'
import { Suspense } from 'react'

interface Props { params: Promise<{ slug: string }> }

async function getBlogPost(slug: string) {
  'use cache'
  cacheTag('blog-posts')
  cacheLife('days')
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export const metadata: Metadata = { title: 'Блог — Sons of Mountains' }

async function BlogPostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const heroImage = post.heroImage as { url?: string | null; alt: string } | null

  return (
    <article className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {mediaUrl(heroImage?.url) && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <Image src={mediaUrl(heroImage!.url)!} alt={heroImage!.alt} fill priority quality={88} className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-white/40 mb-10 pb-8 border-b border-white/10">
          {post.author && <span>{post.author}</span>}
          {post.readingTime && <span>{post.readingTime} мин. четене</span>}
        </div>
        {post.content && (
          <div className="prose prose-invert max-w-none">
            <RichText data={post.content as Parameters<typeof RichText>[0]['data']} />
          </div>
        )}
      </div>
    </article>
  )
}

export default function BlogPostPage({ params }: Props) {
  return (
    <Suspense>
      <BlogPostContent params={params} />
    </Suspense>
  )
}
