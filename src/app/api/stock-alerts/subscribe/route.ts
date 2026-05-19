import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { email, name, itemType, itemId } = await req.json()
    if (!email || !itemType || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const itemField = { trip: 'trip', product: 'product', program: 'program', destination: 'destination' }[itemType as string]
    if (!itemField) return NextResponse.json({ error: 'Invalid item type' }, { status: 400 })

    const existing = await payload.find({
      collection: 'stock-alerts',
      where: {
        and: [
          { email: { equals: email } },
          { itemType: { equals: itemType } },
          { [itemField]: { equals: itemId } },
          { status: { equals: 'pending' } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    await payload.create({
      collection: 'stock-alerts',
      data: { email, name, itemType, [itemField]: itemId, status: 'pending' },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Stock alert subscribe error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
