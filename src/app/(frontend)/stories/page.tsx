import { getPayload } from 'payload'
import config from '@payload-config'
import { StoryCard } from '@/components/ui/StoryCard'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import { StoriesHeroBlock } from '@/components/blocks/stories/StoriesHeroBlock'
import { PuckRender } from '@/components/blocks/PuckRender'
import type { Data } from '@puckeditor/core'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Истории' }

const getStoriesPage = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'stories-page', depth: 0, overrideAccess: true })
    } catch { return null }
  },
  ['stories-page-global'],
  { tags: ['stories-page'], revalidate: false },
)

const getStories = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'stories', limit: 50, sort: '-createdAt' })
    return docs
  },
  ['stories-list'],
  { tags: ['stories'], revalidate: false },
)

async function StoriesContent() {
  let stories: any[] = []
  try { stories = await getStories() } catch {}

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

export default async function StoriesPage() {
  const d = (await getStoriesPage()) as any
  const puckData = d?.puckData as Data | null | undefined

  if (puckData?.content?.length) {
    return <PuckRender data={puckData} />
  }

  return (
    <div className="min-h-screen pb-20">
      <StoriesHeroBlock heading={d?.heading} subheading={d?.subheading} />
      <div className="pt-4 pb-20 px-6">
        <div className="max-w-[1440px] mx-auto">
          <Suspense>
            <StoriesContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
