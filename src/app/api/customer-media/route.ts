import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@payload-config'

const ALLOWED_IMAGE = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'])
const ALLOWED_VIDEO = new Set(['video/mp4', 'video/webm', 'video/quicktime'])
const MAX_IMAGE = 20 * 1024 * 1024
const MAX_VIDEO = 200 * 1024 * 1024

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await getPayload({ config })
  const customer = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: session.user.id } },
    limit: 1,
  })
  if (!customer.docs[0]) return NextResponse.json({ docs: [] })

  const media = await payload.find({
    collection: 'customer-media',
    where: { customer: { equals: customer.docs[0].id } },
    sort: '-createdAt',
    limit: 100,
    depth: 2,
  })

  return NextResponse.json(media)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await getPayload({ config })
  const customerResult = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: session.user.id } },
    limit: 1,
  })
  if (!customerResult.docs[0]) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  const customerId = customerResult.docs[0].id

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const destinationId = formData.get('destination') as string | null
  const tripId = formData.get('trip') as string | null
  const caption = formData.get('caption') as string | null
  const takenAt = formData.get('takenAt') as string | null
  const seoAlt = formData.get('seoAlt') as string | null
  const seoTitle = formData.get('seoTitle') as string | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const isImage = ALLOWED_IMAGE.has(file.type)
  const isVideo = ALLOWED_VIDEO.has(file.type)
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }
  if (isImage && file.size > MAX_IMAGE) {
    return NextResponse.json({ error: 'Image too large (max 20MB)' }, { status: 400 })
  }
  if (isVideo && file.size > MAX_VIDEO) {
    return NextResponse.json({ error: 'Video too large (max 200MB)' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const blob = new Blob([buffer], { type: file.type })

  const mediaDoc = await payload.create({
    collection: 'media',
    data: { alt: seoAlt || file.name },
    file: {
      data: buffer,
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
  })

  const cmDoc = await payload.create({
    collection: 'customer-media',
    data: {
      customer: customerId,
      file: mediaDoc.id,
      mediaType: isImage ? 'image' : 'video',
      ...(destinationId ? { destination: destinationId } : {}),
      ...(tripId ? { trip: tripId } : {}),
      ...(caption ? { caption } : {}),
      ...(takenAt ? { takenAt } : {}),
      ...(seoAlt ? { seoAlt } : {}),
      ...(seoTitle ? { seoTitle } : {}),
      status: 'pending',
    },
  })

  return NextResponse.json({ id: cmDoc.id, mediaId: mediaDoc.id }, { status: 201 })
}
