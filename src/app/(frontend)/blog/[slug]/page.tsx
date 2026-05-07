import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'blog-posts', limit: 200 })
    if (docs.length > 0) return docs.map((p) => ({ slug: p.slug }))
  } catch {}
  return [{ slug: '_placeholder' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1 })
  const post = docs[0]
  if (!post) return { title: 'Пост' }
  return { title: post.title, description: post.excerpt ?? undefined }
}

export default async function BlogPostPage({ params }: Props) {
  'use cache'
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  const heroImage = post.heroImage as { url?: string | null; alt: string } | null

  return (
    <article className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {heroImage?.url && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <Image src={heroImage.url} alt={heroImage.alt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
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
