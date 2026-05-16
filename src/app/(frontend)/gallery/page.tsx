import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
import { GalleryHeroBlock } from '@/components/blocks/gallery/GalleryHeroBlock'
import { GalleryGridBlock } from '@/components/blocks/gallery/GalleryGridBlock'
import { GalleryEditButton } from '@/components/ui/GalleryEditButton'
import { GalleryKeyboardHints } from '@/components/ui/GalleryKeyboardHints'
import { mediaUrl } from '@/lib/media-url'

const getGalleryData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const gallery = await payload.findGlobal({ slug: 'gallery', depth: 1 }) as any

    const featuredIds: string[] = (gallery?.featuredCollections ?? [])
      .map((f: any) => typeof f.collection === 'object' ? f.collection?.id : f.collection)
      .filter(Boolean)

    let collections: any[] = []
    if (featuredIds.length > 0) {
      const { docs } = await payload.find({
        collection: 'gallery-collections',
        where: { id: { in: featuredIds }, status: { equals: 'published' } },
        depth: 2,
        limit: 20,
      })
      collections = featuredIds
        .map((id) => docs.find((d: any) => String(d.id) === String(id)))
        .filter(Boolean)
    } else {
      const { docs } = await payload.find({
        collection: 'gallery-collections',
        where: { status: { equals: 'published' } },
        depth: 2,
        sort: '-publishedAt',
        limit: 12,
      })
      collections = docs
    }

    return { gallery, collections }
  },
  ['gallery-page'],
  { tags: ['gallery', 'gallery-collections'], revalidate: 3600 }
)

export async function generateMetadata(): Promise<Metadata> {
  const { gallery, collections } = await getGalleryData()
  const firstCover = collections[0]?.coverImage
  const ogImage = mediaUrl(firstCover?.url)

  return {
    title: gallery?.heading ?? 'Галерия',
    description: gallery?.subheading ?? 'Фото галерии от нашите дестинации',
    openGraph: {
      title: gallery?.heading ?? 'Галерия',
      description: gallery?.subheading ?? '',
      images: ogImage ? [{ url: ogImage }] : [],
    },
    alternates: {
      types: { 'application/rss+xml': '/gallery/feed.xml' },
    },
  }
}

export default async function GalleryPage() {
  const { gallery, collections } = await getGalleryData()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: gallery?.heading ?? 'Галерия',
    description: gallery?.subheading ?? '',
    numberOfItems: collections.length,
    itemListElement: collections.map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/gallery/${c.slug}`,
      name: c.title,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0a]">
        <GalleryHeroBlock
          heading={gallery?.heading ?? 'Фото галерии от нашите дестинации'}
          subheading={gallery?.subheading ?? ''}
          ctaLabel={gallery?.ctaLabel ?? 'Виж всички снимки'}
        />

        <GalleryGridBlock collections={collections} />

        <GalleryEditButton />
        <GalleryKeyboardHints />
      </div>
    </>
  )
}
