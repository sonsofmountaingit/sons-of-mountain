import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const payload = await getPayload({ config })

  const { docs: users } = await payload.find({
    collection: 'users',
    where: { username: { equals: username } },
    depth: 1,
    limit: 1,
  })

  if (!users.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
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
    collections
      .map((c: any) => typeof c.destination === 'object' ? c.destination?.id : c.destination)
      .filter(Boolean)
  )

  const totalPhotos = collections.reduce((sum: number, c: any) => sum + (c.images?.length ?? 0), 0)

  return NextResponse.json({
    user,
    stats: {
      collections: collectionsRes.totalDocs,
      destinations: destinationIds.size,
      trips: tripsRes.totalDocs,
      programs: programsRes.totalDocs,
      photos: totalPhotos,
    },
    collections,
    trips: tripsRes.docs,
    programs: programsRes.docs,
  })
}
