import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@payload-config'

async function resolveCustomerId(session: Awaited<ReturnType<typeof auth.api.getSession>>) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: session!.user.id } },
    limit: 1,
  })
  return result.docs[0]?.id ?? null
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const customerId = await resolveCustomerId(session)
  if (!customerId) return NextResponse.json({ docs: [] })

  const payload = await getPayload({ config })
  const ratings = await payload.find({
    collection: 'customer-ratings',
    where: { customer: { equals: customerId } },
    sort: '-createdAt',
    limit: 100,
    depth: 2,
  })

  return NextResponse.json(ratings)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const customerId = await resolveCustomerId(session)
  if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  const body = await req.json() as {
    destinationId?: string
    tripId?: string
    rating: number
    review?: string
  }

  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
  }
  if (!body.destinationId && !body.tripId) {
    return NextResponse.json({ error: 'Provide destinationId or tripId' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const where: Record<string, unknown> = { customer: { equals: customerId } }
  if (body.destinationId) where.destination = { equals: body.destinationId }
  else if (body.tripId) where.trip = { equals: body.tripId }

  const existing = await payload.find({
    collection: 'customer-ratings',
    where: where as any,
    limit: 1,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'customer-ratings',
      id: existing.docs[0].id,
      data: { rating: body.rating, review: body.review },
    })
    return NextResponse.json(updated)
  }

  const created = await payload.create({
    collection: 'customer-ratings',
    data: {
      customer: customerId,
      ...(body.destinationId ? { destination: body.destinationId } : {}),
      ...(body.tripId ? { trip: body.tripId } : {}),
      rating: body.rating,
      ...(body.review ? { review: body.review } : {}),
    },
  })

  return NextResponse.json(created, { status: 201 })
}
