import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'gallery-collections',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })

  if (!docs.length) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(docs[0])
}
