import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { rating, review, itemType, itemId } = await req.json()
    if (!rating || !itemType || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const betterAuthUserId = (session.user as any).id

    const customer = await payload.find({
      collection: 'customers',
      where: { betterAuthId: { equals: betterAuthUserId } },
      limit: 1,
    })
    const cust = customer.docs[0]
    if (!cust) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

    // Verify purchase for trips and programs
    if (itemType === 'trip' || itemType === 'program') {
      const registration = await payload.find({
        collection: 'registrations',
        where: {
          and: [
            { customer: { equals: cust.id } },
            { [itemType]: { equals: itemId } },
            { status: { equals: 'paid' } },
          ],
        },
        limit: 1,
      })
      if (!registration.docs.length) {
        return NextResponse.json({ error: 'You can only review items you have booked' }, { status: 403 })
      }
    }

    if (itemType === 'product') {
      const order = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { customer: { equals: cust.id } },
            { status: { equals: 'paid' } },
          ],
        },
        limit: 50,
      })
      const hasPurchased = order.docs.some((o: any) =>
        (o.items as any[])?.some((i: any) => i.itemType === 'product' && (typeof i.product === 'string' ? i.product : i.product?.id) === itemId)
      )
      if (!hasPurchased) {
        return NextResponse.json({ error: 'You can only review products you have purchased' }, { status: 403 })
      }
    }

    const itemField = { trip: 'trip', program: 'program', product: 'product', destination: 'destination' }[itemType as string]

    const ratingDoc = await payload.create({
      collection: 'customer-ratings',
      data: { customer: cust.id, rating, review, [itemField!]: itemId },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true, id: ratingDoc.id })
  } catch (err: any) {
    if (err?.message?.includes('Вече си оценил')) {
      return NextResponse.json({ error: 'You have already rated this item' }, { status: 409 })
    }
    console.error('Rating submit error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
