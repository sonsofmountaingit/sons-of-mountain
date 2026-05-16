import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { mediaUrl } from '@/lib/media-url'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Gallery Embed', robots: { index: false } }
}

export default async function GalleryEmbedPage({ params }: Props) {
  const { slug } = await params
  const getCollection = unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'gallery-collections',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        depth: 2,
        limit: 1,
      })
      return docs[0] ?? null
    },
    [`gallery-embed-${slug}`],
    { tags: ['gallery-collections'], revalidate: 3600 }
  )
  const collection = await getCollection()
  if (!collection) notFound()
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://panicframe.com'

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif', padding: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 12 }}>
        {(collection.images ?? []).slice(0, 9).map((img: any, i: number) => {
          const url = mediaUrl(img?.image?.url)
          if (!url) return null
          return (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
              <Image src={url} alt={img?.caption ?? ''} fill style={{ objectFit: 'cover' }} sizes="33vw" />
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>{collection.title}</p>
        <a
          href={`${baseUrl}/gallery/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#e05a2b', fontSize: 11, textDecoration: 'none' }}
        >
          View full gallery →
        </a>
      </div>
    </div>
  )
}
