import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, name, itemType, itemId } = await req.json()
    if (!email || !itemType || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)
    const betterAuthUserId = (session?.user as any)?.id ?? null

    const payload = await getPayload({ config })
    const itemField = { trip: 'trip', program: 'program', destination: 'destination', product: 'product' }[itemType as string]
    if (!itemField) return NextResponse.json({ error: 'Invalid item type' }, { status: 400 })

    const existing = await payload.find({
      collection: 'waitlist',
      where: {
        and: [
          { email: { equals: email } },
          { itemType: { equals: itemType } },
          { [itemField]: { equals: itemId } },
          { status: { equals: 'waiting' } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ ok: true, position: existing.docs[0].position, alreadyWaiting: true })
    }

    const allWaiting = await payload.find({
      collection: 'waitlist',
      where: {
        and: [
          { itemType: { equals: itemType } },
          { [itemField]: { equals: itemId } },
          { status: { equals: 'waiting' } },
        ],
      },
      limit: 0,
    })

    const position = allWaiting.totalDocs + 1

    await payload.create({
      collection: 'waitlist',
      data: { email, name, betterAuthUserId, itemType, [itemField]: itemId, position, status: 'waiting' },
    })

    return NextResponse.json({ ok: true, position })
  } catch (err) {
    console.error('Waitlist join error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
