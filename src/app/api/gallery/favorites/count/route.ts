import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const collectionId = searchParams.get('collectionId')
  if (!collectionId) return NextResponse.json({ count: 0 })

  const payload = await getPayload({ config })
  const { totalDocs } = await payload.find({
    collection: 'favorites',
    where: { galleryCollection: { equals: collectionId } },
    limit: 0,
  })

  return NextResponse.json({ count: totalDocs }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  })
}
