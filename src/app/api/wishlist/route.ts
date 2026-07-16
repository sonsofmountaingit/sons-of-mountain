import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

async function getCustomer(reqHeaders: Headers) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user || user.collection !== 'customers') return { payload, customer: null }
  const customer = await payload.findByID({ collection: 'customers', id: user.id }).catch(() => null)
  return { payload, customer }
}

export async function GET(req: NextRequest) {
  const { customer } = await getCustomer(req.headers)
  if (!customer) return NextResponse.json({ wishlist: [] })

  return NextResponse.json({ wishlist: (customer as { wishlist?: unknown[] }).wishlist ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { itemType: 'trip' | 'program'; id: string }
  const { itemType, id } = body

  const { payload, customer } = await getCustomer(req.headers)
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  type WishlistItem = { itemType: string; trip?: string; program?: string }
  const wishlist: WishlistItem[] = ((customer as { wishlist?: WishlistItem[] }).wishlist ?? [])

  const exists = wishlist.some(
    (w) => w.itemType === itemType && (itemType === 'trip' ? w.trip === id : w.program === id)
  )
  if (exists) return NextResponse.json({ ok: true })

  const newItem: WishlistItem = itemType === 'trip' ? { itemType: 'trip', trip: id } : { itemType: 'program', program: id }
  await payload.update({
    collection: 'customers',
    id: customer.id,
    data: { wishlist: [...wishlist, newItem] } as Record<string, unknown>,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json() as { itemType: 'trip' | 'program'; id: string }
  const { itemType, id } = body

  const { payload, customer } = await getCustomer(req.headers)
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  type WishlistItem = { itemType: string; trip?: string; program?: string }
  const wishlist: WishlistItem[] = ((customer as { wishlist?: WishlistItem[] }).wishlist ?? [])

  const filtered = wishlist.filter(
    (w) => !(w.itemType === itemType && (itemType === 'trip' ? w.trip === id : w.program === id))
  )

  await payload.update({
    collection: 'customers',
    id: customer.id,
    data: { wishlist: filtered } as Record<string, unknown>,
  })

  return NextResponse.json({ ok: true })
}
