import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { reconcileCheckoutSession } from '@/lib/cron/reconcile-checkout-payments'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

  // Stripe redirect is a second, immediate confirmation path; the webhook and
  // scheduled reconciliation remain idempotent fallbacks.
  await reconcileCheckoutSession(sessionId).catch((error) => {
    console.error('Failed to reconcile Checkout session after redirect:', error)
  })

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
