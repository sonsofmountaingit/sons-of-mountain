import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { mediaUrl } from '@/lib/media-url'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'


interface Props { params: Promise<{ slug: string }> }


async function getStory(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'stories', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export const metadata: Metadata = { title: 'Истории — Sons of Mountains' }

async function StoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)
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
          {mediaUrl(author.avatar?.url) && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src={mediaUrl(author.avatar!.url)!} alt={author.name} fill className="object-cover" sizes="40px" />
            </div>
          )}
          <span className="text-sm text-white/60">{author.name}</span>
        </div>
        {mediaUrl(heroImage?.url) && (
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-12">
            <Image src={mediaUrl(heroImage!.url)!} alt={heroImage!.alt} fill priority quality={88} className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
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

export default function StoryPage({ params }: Props) {
  return (
    <Suspense>
      <StoryContent params={params} />
    </Suspense>
  )
}
