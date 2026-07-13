import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

  const payload = await getPayload({ config })

  const orders = await payload.find({
    collection: 'orders',
    where: { stripeSessionId: { equals: sessionId } },
    depth: 2,
    limit: 1,
  })
  if (orders.docs[0]) return NextResponse.json({ type: 'order', doc: orders.docs[0] })

  const registrations = await payload.find({
    collection: 'registrations',
    where: { stripeSessionId: { equals: sessionId } },
    depth: 2,
    limit: 1,
  })
  if (registrations.docs[0]) return NextResponse.json({ type: 'registration', doc: registrations.docs[0] })

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
