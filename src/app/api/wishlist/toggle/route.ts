import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { itemType, itemId } = await req.json()
    const betterAuthUserId = (session.user as any).id
    const payload = await getPayload({ config })

    const customer = await payload.find({ collection: 'customers', where: { betterAuthId: { equals: betterAuthUserId } }, limit: 1 })
    const cust = customer.docs[0]
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
