import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'stories', limit: 200 })
    if (docs.length > 0) return docs.map((s) => ({ slug: s.slug }))
  } catch {}
  return [{ slug: '_placeholder' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  'use cache'
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'stories', where: { slug: { equals: slug } }, limit: 1 })
  const story = docs[0]
  if (!story) return { title: 'История' }
  return { title: story.title }
}

export default async function StoryPage({ params }: Props) {
  'use cache'
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'stories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const story = docs[0]
  if (!story) notFound()

  const destination = typeof story.destination === 'object' ? story.destination as { name: string; slug: string } : null
  const heroImage = story.heroImage as { url?: string | null; alt: string } | null
  const author = story.author as { name: string; avatar?: { url?: string | null; alt: string } | null }

  return (
    <article className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {destination && (
          <Link href={`/destinations/${destination.slug}`} className="text-xs font-semibold tracking-widest text-white/40 uppercase hover:text-white/70 transition-colors mb-6 inline-block">
            ← {destination.name}
          </Link>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{story.title}</h1>
        <div className="flex items-center gap-3 mb-10">
          {author.avatar?.url && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src={author.avatar.url} alt={author.name} fill className="object-cover" sizes="40px" />
            </div>
          )}
          <span className="text-sm text-white/60">{author.name}</span>
        </div>
        {heroImage?.url && (
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-12">
            <Image src={heroImage.url} alt={heroImage.alt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}
        {story.content && (
          <div className="prose prose-invert max-w-none">
            <RichText data={story.content as Parameters<typeof RichText>[0]['data']} />
          </div>
        )}
      </div>
    </article>
  )
}
