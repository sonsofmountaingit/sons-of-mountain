import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

async function getCustomer(betterAuthId: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: betterAuthId } },
    limit: 1,
  })
  return { payload, customer: docs[0] ?? null }
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) return NextResponse.json({ wishlist: [] })

  const { customer } = await getCustomer(session.user.id)
  if (!customer) return NextResponse.json({ wishlist: [] })

  return NextResponse.json({ wishlist: (customer as { wishlist?: unknown[] }).wishlist ?? [] })
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { itemType: 'trip' | 'program'; id: string }
  const { itemType, id } = body

  const { payload, customer } = await getCustomer(session.user.id)
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
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { itemType: 'trip' | 'program'; id: string }
  const { itemType, id } = body

  const { payload, customer } = await getCustomer(session.user.id)
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
