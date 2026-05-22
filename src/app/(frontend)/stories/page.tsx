import { getPayload } from 'payload'
import config from '@payload-config'
import { StoryCard } from '@/components/ui/StoryCard'
import type { Metadata } from 'next'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'

export const metadata: Metadata = { title: 'Истории' }

export default async function StoriesPage() {
  'use cache'
  cacheTag('stories')
  cacheLife('days')
  let stories: any[] = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'stories',
      limit: 50,
      sort: '-createdAt',
    })
    stories = docs
  } catch {}

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Истории</h1>
        <p className="text-white/50 mb-12 text-lg">Разкази от нашите пътешественици</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              title={story.title}
              slug={story.slug}
              heroImage={story.heroImage as { url?: string | null; alt: string } | null}
              author={story.author as { name: string; avatar?: { url?: string | null } | null }}
              destinationName={typeof story.destination === 'object' ? (story.destination as { name: string })?.name : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
