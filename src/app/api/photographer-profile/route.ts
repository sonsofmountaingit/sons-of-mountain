import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

async function getPayloadUser(betterAuthId: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { exists: true } },
    limit: 200,
    depth: 1,
  })
  // Users collection uses email as auth identifier; match by email via session
  return { payload, users: docs }
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: session.user.email } },
    depth: 1,
    limit: 1,
  })
  const user = docs[0] ?? null
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, username, bio, instagramHandle, profileImageId } = body

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: session.user.email } },
    limit: 1,
  })
  const user = docs[0]
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

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

  after(() => { revalidateTag('gallery-collections', 'default') })

  return NextResponse.json({ ok: true, user: updated })
}
