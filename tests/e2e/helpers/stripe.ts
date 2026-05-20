import Stripe from 'stripe'
import { execSync } from 'child_process'

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-04-22.dahlia' as any,
  })
}

export async function triggerWebhook(event: string, args?: string) {
  execSync(`stripe trigger ${event}${args ? ` ${args}` : ''}`, { stdio: 'pipe' })
  await new Promise((r) => setTimeout(r, 2000)) // wait for webhook processing
}

export async function simulateCheckoutCompleted(stripe: Stripe, sessionId: string) {
  // For test mode: retrieve the session and simulate webhook via Stripe CLI
  // stripe trigger checkout.session.completed --override checkout_session:id=<sessionId>
  execSync(`stripe trigger checkout.session.completed --override "checkout_session:id=${sessionId}"`, { stdio: 'pipe' })
  await new Promise((r) => setTimeout(r, 3000))
}

export async function createTestCheckoutSession(
  stripe: Stripe,
  opts: {
    amount: number
    metadata: Record<string, string>
    customerEmail?: string
    successUrl?: string
    cancelUrl?: string
  }
) {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'eur', product_data: { name: 'Test Item' }, unit_amount: Math.round(opts.amount * 100) }, quantity: 1 }],
    success_url: opts.successUrl ?? `${base}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: opts.cancelUrl ?? `${base}/shop/cancel`,
    customer_email: opts.customerEmail,
    metadata: opts.metadata,
  })
}
