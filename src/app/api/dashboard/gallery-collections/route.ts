import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

async function getAuthedPhotographer(reqHeaders: Headers) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: reqHeaders })
  return { payload, userId: user?.collection === 'users' ? user.id : null }
}

// GET — list this photographer's collections
export async function GET(req: NextRequest) {
  const { payload, userId } = await getAuthedPhotographer(await headers())
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await payload.find({
    collection: 'gallery-collections',
    where: { photographer: { equals: userId } },
    sort: '-publishedAt',
    depth: 1,
    limit: 100,
  })

  return NextResponse.json(result)
}

// POST — create a new collection
export async function POST(req: NextRequest) {
  const { payload, userId } = await getAuthedPhotographer(await headers())
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, slug, description, coverImageId, destinationId, latitude, longitude, status } = body

  if (!title || !slug || !coverImageId) {
    return NextResponse.json({ error: 'title, slug, coverImageId required' }, { status: 400 })
  }

  const doc = await payload.create({
    collection: 'gallery-collections',
    data: {
      title,
      slug,
      description: description ?? '',
      coverImage: coverImageId,
      photographer: userId,
      ...(destinationId ? { destination: destinationId } : {}),
      ...(latitude ? { latitude: Number(latitude) } : {}),
      ...(longitude ? { longitude: Number(longitude) } : {}),
      status: status ?? 'draft',
      publishedAt: new Date().toISOString(),
      images: [],
    },
  })

  after(() => { (revalidateTag as any)('gallery-collections', 'max') })
  return NextResponse.json(doc, { status: 201 })
}

// PATCH — update collection fields or images
export async function PATCH(req: NextRequest) {
  const { payload, userId } = await getAuthedPhotographer(await headers())
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, title, slug, description, coverImageId, destinationId, latitude, longitude, status, images } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Verify ownership
  const existing = await payload.findByID({ collection: 'gallery-collections', id })
  const ownerId = typeof (existing as any).photographer === 'object'
    ? (existing as any).photographer?.id
    : (existing as any).photographer
  if (String(ownerId) !== String(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await payload.update({
    collection: 'gallery-collections',
    id,
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(coverImageId !== undefined ? { coverImage: coverImageId } : {}),
      ...(destinationId !== undefined ? { destination: destinationId } : {}),
      ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
      ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(images !== undefined ? { images } : {}),
    },
  })

  after(() => { (revalidateTag as any)('gallery-collections', 'max') })
  return NextResponse.json(updated)
}

// DELETE — remove a collection
export async function DELETE(req: NextRequest) {
  const { payload, userId } = await getAuthedPhotographer(await headers())
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const existing = await payload.findByID({ collection: 'gallery-collections', id })
  const ownerId = typeof (existing as any).photographer === 'object'
    ? (existing as any).photographer?.id
    : (existing as any).photographer
  if (String(ownerId) !== String(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await payload.delete({ collection: 'gallery-collections', id })
  after(() => { (revalidateTag as any)('gallery-collections', 'max') })
  return NextResponse.json({ ok: true })
}
