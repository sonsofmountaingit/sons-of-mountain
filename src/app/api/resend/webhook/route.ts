import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '@payload-config'
import { Resend, type WebhookEventPayload } from 'resend'

const trackedEvents = new Set([
  'email.sent', 'email.delivered', 'email.delivery_delayed', 'email.failed',
  'email.suppressed', 'email.bounced', 'email.complained', 'email.opened', 'email.clicked',
])

function providerError(event: WebhookEventPayload): string | undefined {
  const data = event.data as any
  if (event.type === 'email.failed') return data.failed?.reason
  if (event.type === 'email.suppressed') return data.suppressed?.message ?? data.suppressed?.type
  if (event.type === 'email.bounced') return data.bounce?.message ?? data.bounce?.type
  return undefined
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('RESEND_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 })
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing webhook signature headers' }, { status: 401 })
  }

  const rawBody = await req.text()
  let event: WebhookEventPayload
  try {
    event = new Resend().webhooks.verify({
      payload: rawBody,
      headers: { id: svixId, timestamp: svixTimestamp, signature: svixSignature },
      webhookSecret,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  // We deliberately accept non-email Resend events. They are not part of this
  // audit trail, but acknowledging them prevents needless Resend retries.
  if (!trackedEvents.has(event.type)) return NextResponse.json({ ok: true })

  const payload = await getPayload({ config })
  const emailId = (event.data as any).email_id as string | undefined
  const eventAt = event.created_at ?? new Date().toISOString()
  const existing = await payload.db.drizzle.execute(sql`
    SELECT "id" FROM "resend_webhook_events" WHERE "svix_id" = ${svixId} LIMIT 1
  `)
  if ((existing as any).rows?.length) return NextResponse.json({ ok: true, duplicate: true })

  const logs = emailId
    ? await payload.find({ collection: 'email-logs', where: { resendMessageId: { equals: emailId } }, limit: 1 })
    : { docs: [] as any[] }
  const log = logs.docs[0] as any

  const inserted = await payload.db.drizzle.execute(sql`
    INSERT INTO "resend_webhook_events" ("svix_id", "resend_message_id", "event_type", "event_created_at", "email_log_id")
    VALUES (${svixId}, ${emailId ?? null}, ${event.type}, ${eventAt}, ${log?.id ?? null})
    ON CONFLICT ("svix_id") DO NOTHING
    RETURNING "id"
  `)
  if (!(inserted as any).rows?.length) return NextResponse.json({ ok: true, duplicate: true })

  if (!log) return NextResponse.json({ ok: true, tracked: false })

  const statusByEvent: Record<string, string> = {
    'email.sent': 'sent',
    'email.delivered': 'delivered',
    'email.delivery_delayed': 'delayed',
    'email.failed': 'failed',
    'email.suppressed': 'suppressed',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
    'email.opened': 'opened',
    'email.clicked': 'clicked',
  }
  const dateByEvent: Record<string, string> = {
    'email.sent': 'sentAt',
    'email.delivered': 'deliveredAt',
    'email.delivery_delayed': 'delayedAt',
    'email.failed': 'failedAt',
    'email.suppressed': 'suppressedAt',
    'email.bounced': 'bouncedAt',
    'email.complained': 'complainedAt',
    'email.opened': 'openedAt',
    'email.clicked': 'clickedAt',
  }
  const terminalEvents = new Set(['email.delivered', 'email.failed', 'email.suppressed', 'email.bounced', 'email.complained'])
  const currentEventAt = log.lastEventAt ? new Date(log.lastEventAt).getTime() : 0
  const isNewer = new Date(eventAt).getTime() >= currentEventAt
  const update: Record<string, unknown> = {
    [dateByEvent[event.type]]: eventAt,
    ...(isNewer ? { lastEventType: event.type, lastEventAt: eventAt } : {}),
  }

  // Opens/clicks are engagement signals, not delivery state. Likewise, an old
  // delayed/sent event must never overwrite a terminal delivery result.
  if (terminalEvents.has(event.type) && isNewer) {
    update.status = statusByEvent[event.type]
  } else if (event.type === 'email.delivery_delayed' && !terminalEvents.has(log.lastEventType) && isNewer) {
    update.status = 'delayed'
  } else if (event.type === 'email.sent' && !log.status && isNewer) {
    update.status = 'sent'
  }
  const error = providerError(event)
  if (error) update.deliveryError = error

  await payload.update({ collection: 'email-logs', id: log.id, data: update as any })

  if (event.type === 'email.bounced' || event.type === 'email.complained') {
    const recipient = log.recipient
    if (recipient) {
      const subscribers = await payload.find({ collection: 'subscribers', where: { email: { equals: recipient } }, limit: 1 })
      if (subscribers.docs[0]) {
        await payload.update({
          collection: 'subscribers',
          id: subscribers.docs[0].id,
          data: { status: event.type === 'email.complained' ? 'unsubscribed' : 'bounced' },
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}
