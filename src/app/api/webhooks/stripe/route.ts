import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '@payload-config'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import {
  handleCheckoutCompleted,
  handleCheckoutAsyncPaymentFailed,
  handleSubscriptionUpsert,
  handleSubscriptionDeleted,
  handleChargeRefunded,
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
  handleInvoiceFinalized,
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
} from '@/lib/stripe-webhooks'

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

  const signature = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET
  if (!signature || !secret) return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const expectedLiveMode = process.env.STRIPE_LIVEMODE
    ? process.env.STRIPE_LIVEMODE === 'true'
    : process.env.NODE_ENV === 'production'
  if (event.livemode !== expectedLiveMode) {
    return NextResponse.json({ error: 'Invalid Stripe mode' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const eventObject = event.data.object as { metadata?: Record<string, string> }
  const orderId = eventObject.metadata?.orderId ?? null
  const existingEvent = await payload.db.drizzle.execute(sql`
    SELECT "id", "status" FROM "stripe_webhook_events"
    WHERE "stripe_event_id" = ${event.id}
    LIMIT 1
  `)
  const existingRow = (existingEvent as any).rows?.[0]
  if (existingRow?.status === 'processed') return NextResponse.json({ received: true, duplicate: true })
  if (existingRow?.status === 'processing') return NextResponse.json({ error: 'Event is already being processed' }, { status: 409 })

  if (existingRow) {
    await payload.db.drizzle.execute(sql`
      UPDATE "stripe_webhook_events"
      SET "status" = 'processing', "attempts" = "attempts" + 1, "last_error" = NULL
      WHERE "id" = ${existingRow.id}
    `)
  } else {
    const inserted = await payload.db.drizzle.execute(sql`
      INSERT INTO "stripe_webhook_events" ("stripe_event_id", "event_type", "status", "order_id")
      VALUES (${event.id}, ${event.type}, 'processing', ${orderId})
      ON CONFLICT ("stripe_event_id") DO NOTHING
      RETURNING "id"
    `)
    if (!(inserted as any).rows?.length) return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, payload)
      break
    case 'checkout.session.async_payment_failed':
      await handleCheckoutAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session, payload)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, payload)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, payload)
      break
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge, payload)
      break
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, payload)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, payload)
      break
    case 'invoice.finalized':
      await handleInvoiceFinalized(event.data.object as Stripe.Invoice, payload)
      break
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, payload)
      break
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, payload)
      break
      default:
        break
    }
  } catch (error) {
    const failureMessage = error instanceof Error ? error.message.slice(0, 2000) : String(error).slice(0, 2000)
    await payload.db.drizzle.execute(sql`
      UPDATE "stripe_webhook_events"
      SET "status" = 'failed', "last_error" = ${failureMessage}
      WHERE "stripe_event_id" = ${event.id}
    `).catch(() => undefined)
    if (orderId) {
      await payload.update({
        collection: 'orders',
        id: orderId,
        data: { fulfillmentStatus: 'failed', fulfillmentFailureReason: failureMessage } as any,
        overrideAccess: true,
      }).catch(() => undefined)
    }
    console.error('[stripe-webhook] processing failed', { eventId: event.id, eventType: event.type, orderId, error })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  await payload.db.drizzle.execute(sql`
    UPDATE "stripe_webhook_events"
    SET "status" = 'processed', "processed_at" = now(), "last_error" = NULL
    WHERE "stripe_event_id" = ${event.id}
  `)
  return NextResponse.json({ received: true })
}
