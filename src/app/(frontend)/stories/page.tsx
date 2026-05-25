import { getPayload } from 'payload'
import config from '@payload-config'
import { StoryCard } from '@/components/ui/StoryCard'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Истории' }

const getStories = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'stories',
      limit: 50,
      sort: '-createdAt',
    })
    return docs
  },
  ['stories-list'],
  { tags: ['stories'], revalidate: 3600 },
)

async function StoriesContent() {
  let stories: any[] = []
  try {
    stories = await getStories()
  } catch {}

  return (
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
  )
}

export default function StoriesPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Истории</h1>
        <p className="text-white/50 mb-12 text-lg">Разкази от нашите пътешественици</p>
        <Suspense>
          <StoriesContent />
        </Suspense>
      </div>
    </div>
  )
}
