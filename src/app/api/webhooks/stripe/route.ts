import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import {
  handleCheckoutCompleted,
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

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, payload)
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

  return NextResponse.json({ received: true })
}
