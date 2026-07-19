import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { sendFlow } from '@/lib/email-flows'

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, participantCount, message, source, itemType, itemId } = await req.json()
    if (!email || !itemType || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const authPayload = await getPayload({ config })
    const { user } = await authPayload.auth({ headers: await headers() })
    const customerId = user?.collection === 'customers' ? user.id : null

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
      overrideAccess: true,
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
      overrideAccess: true,
    })

    const position = allWaiting.totalDocs + 1

    await payload.create({
      collection: 'waitlist',
      data: {
        email,
        name,
        phone,
        participantCount: participantCount ?? 1,
        message,
        source: source ?? 'sold-out',
        customer: customerId,
        itemType,
        [itemField]: itemId,
        position,
        status: 'waiting',
      },
    })

    const collectionMap = { trip: 'trips', program: 'programs', destination: 'destinations', product: 'products' } as const
    const item = await payload.findByID({ collection: collectionMap[itemType as keyof typeof collectionMap], id: itemId }).catch(() => null)
    const itemTitle = itemType === 'destination' ? (item as any)?.name : (item as any)?.title
    await sendFlow('waitlist_joined', { email, firstName: name }, {
      itemTitle: itemTitle ?? '',
      waitlistPosition: position,
    }, payload).catch(() => {})

    return NextResponse.json({ ok: true, position })
  } catch (err) {
    console.error('Waitlist join error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
