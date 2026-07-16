import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    id: user.id,
    name: user.name ?? '',
    username: (user as any).username ?? '',
    bio: (user as any).bio ?? '',
    instagramHandle: (user as any).instagramHandle ?? '',
    profileImage: (user as any).profileImage ?? null,
  })
}

export async function PATCH(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, username, bio, instagramHandle, profileImageId } = body

  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(username !== undefined ? { username } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(instagramHandle !== undefined ? { instagramHandle } : {}),
      ...(profileImageId !== undefined ? { profileImage: profileImageId } : {}),
    },
  })

  after(() => { (revalidateTag as any)('gallery-collections', 'max') })

  return NextResponse.json({ ok: true, user: updated })
}
