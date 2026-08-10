import { NextResponse } from 'next/server'

// Resend is configured exclusively for /api/resend/webhook, where Svix
// signatures and event idempotency are enforced. Keep this legacy path inert so
// an unauthenticated caller cannot alter subscriber delivery status.
export async function POST() {
  return NextResponse.json({ error: 'Webhook endpoint moved' }, { status: 410 })
}
