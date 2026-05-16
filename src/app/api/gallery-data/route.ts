import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const gallery = await payload.findGlobal({ slug: 'gallery', depth: 3 }) as any

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
    }

    return NextResponse.json({ ...gallery, resolvedCollections: collections })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
