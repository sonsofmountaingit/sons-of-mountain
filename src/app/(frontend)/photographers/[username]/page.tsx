import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GalleryGridBlock } from '@/components/blocks/gallery/GalleryGridBlock'
import { mediaUrl } from '@/lib/media-url'


interface Props {
  params: Promise<{ username: string }>
}

async function getPhotographerDataRaw(username: string) {
  const payload = await getPayload({ config })

  const { docs: users } = await payload.find({
    collection: 'users',
    where: { username: { equals: username } },
    depth: 2,
    limit: 1,
  })
  if (!users.length) return null
  const user = users[0] as any

  const [collectionsRes, tripsRes, programsRes] = await Promise.all([
    payload.find({
      collection: 'gallery-collections',
      where: { photographer: { equals: user.id }, status: { equals: 'published' } },
      depth: 2,
      limit: 100,
    }),
    payload.find({
      collection: 'trips',
      where: { photographer: { equals: user.id } },
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'programs',
      where: { photographer: { equals: user.id } },
      depth: 1,
      limit: 100,
    }),
  ])

  const collections = collectionsRes.docs as any[]
  const destinationIds = new Set(
    collections.map((c: any) => typeof c.destination === 'object' ? c.destination?.id : c.destination).filter(Boolean)
  )
  const totalPhotos = collections.reduce((sum: number, c: any) => sum + (c.images?.length ?? 0), 0)

  return {
    user,
    stats: {
      collections: collectionsRes.totalDocs,
      destinations: destinationIds.size,
      trips: tripsRes.totalDocs,
      programs: programsRes.totalDocs,
      photos: totalPhotos,
    },
    collections,
  }
}

const getPhotographerData = (username: string) =>
  unstable_cache(
    () => getPhotographerDataRaw(username),
    [`photographer-${username}`],
    { tags: ['gallery-collections'], revalidate: 3600 }
  )()


export const metadata: Metadata = {
  title: 'Фотограф — Sons of Mountains',
}

const STAT_LABELS: { key: keyof ReturnType<typeof stubStats>; label: string }[] = [
  { key: 'collections', label: 'Галерии' },
  { key: 'destinations', label: 'Дестинации' },
  { key: 'trips', label: 'Пътувания' },
  { key: 'photos', label: 'Снимки' },
]
function stubStats() { return { collections: 0, destinations: 0, trips: 0, programs: 0, photos: 0 } }

async function PhotographerContent({ params }: Props) {
  const { username } = await params
  const data = await getPhotographerData(username)
  if (!data) notFound()

  const { user, stats, collections } = data
  const avatarUrl = mediaUrl(user.profileImage?.url)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          {avatarUrl ? (
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
              <Image src={avatarUrl} alt={user.name ?? ''} fill className="object-cover" sizes="112px" />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-4xl font-bold shrink-0">
              {(user.name ?? '?')[0].toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{user.name}</h1>
            {user.instagramHandle && (
              <a
                href={`https://instagram.com/${user.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                {user.instagramHandle}
              </a>
            )}
            {user.bio && (
              <p className="text-white/60 text-base mt-4 max-w-xl leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="bg-white/5 rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-1">{stats[key as keyof typeof stats]}</p>
              <p className="text-white/40 text-xs tracking-widest uppercase">{label}</p>
            </div>
          ))}
        </div>

        {collections.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-8">Галерии</h2>
            <GalleryGridBlock collections={collections} />
          </>
        )}
      </div>
    </div>
  )
}

export default function PhotographerPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <PhotographerContent params={params} />
    </Suspense>
  )
}
