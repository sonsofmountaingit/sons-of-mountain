import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { GalleryCollectionClient } from './GalleryCollectionClient'
import { mediaUrl } from '@/lib/media-url'



interface Props {
  params: Promise<{ slug: string }>
}

async function getCollectionWithPhotographer(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'gallery-collections',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        depth: 2,
        limit: 1,
        overrideAccess: true,
      })
      const collection = docs[0] ?? null
      if (!collection) return null

      const photographerId = typeof (collection as any).photographer === 'object'
        ? (collection as any).photographer?.id
        : (collection as any).photographer

      let photographerCollections: any[] = []
      let photographerStats = { collections: 0, destinations: 0, trips: 0, programs: 0, photos: 0 }

      if (photographerId) {
        const [otherCols, tripsRes, programsRes] = await Promise.all([
          payload.find({
            collection: 'gallery-collections',
            where: { photographer: { equals: photographerId }, status: { equals: 'published' }, slug: { not_equals: slug } },
            depth: 2,
            limit: 6,
            sort: '-publishedAt',
            overrideAccess: true,
          }),
          payload.find({ collection: 'trips', where: { photographer: { equals: photographerId } }, limit: 0, overrideAccess: true }),
          payload.find({ collection: 'programs', where: { photographer: { equals: photographerId } }, limit: 0, overrideAccess: true }),
        ])
        photographerCollections = otherCols.docs as any[]
        const allCols = [...photographerCollections, collection as any]
        const destIds = new Set(allCols.map((c: any) => typeof c.destination === 'object' ? c.destination?.id : c.destination).filter(Boolean))
        photographerStats = {
          collections: otherCols.totalDocs + 1,
          destinations: destIds.size,
          trips: tripsRes.totalDocs,
          programs: programsRes.totalDocs,
          photos: allCols.reduce((s: number, c: any) => s + (c.images?.length ?? 0), 0),
        }
      }

      return { collection, photographerCollections, photographerStats }
    },
    [`gallery-collection-full-${slug}`],
    { tags: ['gallery-collections'], revalidate: 3600 }
  )()
}


export const metadata: Metadata = {
  title: 'Галерия — Sons of Mountains',
}

async function GalleryCollectionContent({ params }: Props) {
  const { slug } = await params
  const data = await getCollectionWithPhotographer(slug)
  if (!data) notFound()
  const { collection, photographerCollections, photographerStats } = data

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: (collection as any).title,
    description: (collection as any).description ?? '',
    url: `/gallery/${slug}`,
    numberOfItems: (collection as any).images?.length ?? 0,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GalleryCollectionClient
        collection={collection}
        photographerCollections={photographerCollections}
        photographerStats={photographerStats}
      />
    </>
  )
}

export default function GalleryCollectionPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <GalleryCollectionContent params={params} />
    </Suspense>
  )
}
