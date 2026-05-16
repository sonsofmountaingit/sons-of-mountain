import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

async function getPayloadUserId(email: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  return { payload, userId: docs[0]?.id ?? null }
}

// GET — list this photographer's collections
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payload, userId } = await getPayloadUserId(session.user.email)
  if (!userId) return NextResponse.json({ docs: [] })

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payload, userId } = await getPayloadUserId(session.user.email)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

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

  after(() => { revalidateTag('gallery-collections', 'default') })
  return NextResponse.json(doc, { status: 201 })
}

// PATCH — update collection fields or images
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payload, userId } = await getPayloadUserId(session.user.email)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

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

  after(() => { revalidateTag('gallery-collections', 'default') })
  return NextResponse.json(updated)
}

// DELETE — remove a collection
export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payload, userId } = await getPayloadUserId(session.user.email)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

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
  after(() => { revalidateTag('gallery-collections', 'default') })
  return NextResponse.json({ ok: true })
}
