import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { cartData, email, betterAuthUserId } = await req.json()
    if (!cartData?.items?.length) return NextResponse.json({ ok: true })

    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('som-session-id')?.value ?? crypto.randomUUID()

    const existing = await payload.find({
      collection: 'abandoned-carts',
      where: { sessionId: { equals: sessionId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'abandoned-carts',
        id: existing.docs[0].id,
        data: { cartData, email: email ?? existing.docs[0].email, status: 'active' },
      })
    } else {
      await payload.create({
        collection: 'abandoned-carts',
        data: { sessionId, betterAuthUserId, email, cartData, status: 'active' },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Abandoned cart error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
