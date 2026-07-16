import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { itemType, itemId } = await req.json()

    const cust = await payload.findByID({ collection: 'customers', id: user.id }).catch(() => null)
    if (!cust) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

    const itemField = { trip: 'trip', program: 'program', destination: 'destination', product: 'product' }[itemType as string]
    if (!itemField) return NextResponse.json({ error: 'Invalid item type' }, { status: 400 })

    const wishlist: any[] = ((cust as any).wishlist ?? [])
    const existingIdx = wishlist.findIndex((w: any) => w.itemType === itemType && (typeof w[itemField] === 'string' ? w[itemField] : w[itemField]?.id) === itemId)

    let saved: boolean
    if (existingIdx >= 0) {
      wishlist.splice(existingIdx, 1)
      saved = false
    } else {
      wishlist.push({ itemType, [itemField]: itemId })
      saved = true
    }

    await payload.update({ collection: 'customers', id: cust.id, data: { wishlist } })
    return NextResponse.json({ ok: true, saved })
  } catch (err) {
    console.error('Wishlist toggle error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
