import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const collectionId = searchParams.get('collectionId')
  if (!collectionId) return NextResponse.json({ favorites: [] })

  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders as unknown as Headers })
  if (!user) return NextResponse.json({ favorites: [] })

  const { docs } = await payload.find({
    collection: 'favorites',
    where: { user: { equals: user.id }, galleryCollection: { equals: collectionId } },
    limit: 200,
  })

  return NextResponse.json({ favorites: docs.map((f: any) => f.imageIndex) })
}

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders as unknown as Headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collectionId, imageIndex } = await request.json()

  const existing = await payload.find({
    collection: 'favorites',
    where: { user: { equals: user.id }, galleryCollection: { equals: collectionId }, imageIndex: { equals: imageIndex } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return NextResponse.json({ ok: true, favorited: true })
  }

  await payload.create({
    collection: 'favorites',
    data: { user: user.id, galleryCollection: collectionId, imageIndex },
    overrideAccess: true,
  })

  return NextResponse.json({ ok: true, favorited: true })
}

export async function DELETE(request: Request) {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders as unknown as Headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collectionId, imageIndex } = await request.json()

  const existing = await payload.find({
    collection: 'favorites',
    where: { user: { equals: user.id }, galleryCollection: { equals: collectionId }, imageIndex: { equals: imageIndex } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    await payload.delete({ collection: 'favorites', id: existing.docs[0].id, overrideAccess: true })
  }

  return NextResponse.json({ ok: true, favorited: false })
}
