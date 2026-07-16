import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
const MAX_SIZE = 30 * 1024 * 1024

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const collectionId = formData.get('collectionId') as string | null
  const caption = formData.get('caption') as string | null
  const featured = formData.get('featured') === 'true'
  const takenAt = formData.get('takenAt') as string | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Unsupported type' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 30MB)' }, { status: 400 })

  // Verify ownership if adding to a collection
  if (collectionId) {
    const userId = user.id
    const col = await payload.findByID({ collection: 'gallery-collections', id: collectionId })
    const ownerId = typeof (col as any).photographer === 'object'
      ? (col as any).photographer?.id
      : (col as any).photographer
    if (String(ownerId) !== String(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const mediaDoc = await payload.create({
    collection: 'media',
    data: { alt: caption ?? file.name },
    file: { data: buffer, mimetype: file.type, name: file.name, size: file.size },
  })

  // Append image to collection
  if (collectionId) {
    const col = await payload.findByID({ collection: 'gallery-collections', id: collectionId, depth: 0 })
    const existing = ((col as any).images ?? []) as any[]
    await payload.update({
      collection: 'gallery-collections',
      id: collectionId,
      data: {
        images: [
          ...existing,
          {
            image: mediaDoc.id,
            caption: caption ?? '',
            featured,
            ...(takenAt ? { takenAt } : {}),
          },
        ],
      },
    })
    after(() => { (revalidateTag as any)('gallery-collections', 'max') })
  }

  return NextResponse.json({ id: mediaDoc.id, url: (mediaDoc as any).url ?? '' }, { status: 201 })
}
