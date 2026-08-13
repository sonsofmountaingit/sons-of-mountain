import type { BasePayload } from 'payload'
import { after } from 'next/server'

async function getStripe() {
  const { stripe } = await import('@/lib/stripe')
  return stripe
}

// Stripe sync makes live network calls (products.create/prices.create/etc). Never let
// those calls run synchronously inside a collection's afterChange hook: the create/update
// operation's Payload/Postgres transaction is still open at that point, and awaiting a
// slow/hanging outbound HTTP call there holds the DB connection "idle in transaction"
// until Postgres's idle_in_transaction_session_timeout kills it — which starves the
// connection pool and can crash the whole process (breaking unrelated requests, including
// the Stripe webhook route itself, leaving paid orders stuck as "pending" forever).
//
// next/server's after() defers work until *after* the HTTP response is sent, which is safe,
// but it only works inside a real request scope and throws synchronously otherwise (cron
// jobs, seed scripts, admin panel server actions run outside a request, etc). Previously the
// fallback for that case was to `await` the sync inline — reintroducing the exact hazard
// after() exists to avoid. Instead, always run the sync detached (fire-and-forget) so the
// hook returns immediately and the transaction can commit right away; sync failures are
// logged, never surfaced to the transaction.
export function scheduleStripeSync(args: SyncArgs) {
  const run = () => syncStripeProduct(args).catch((e) => {
    console.error(`Deferred Stripe product sync failed for ${args.collection}/${args.doc?.id}:`, e)
  })
  try {
    after(run)
  } catch {
    void run()
  }
}

interface SyncArgs {
  doc: any
  previousDoc: any
  payload: BasePayload
  collection: string
  priceField?: string
}

export async function syncStripeProduct({ doc, previousDoc, payload, collection, priceField = 'price' }: SyncArgs) {
  const stripe = await getStripe()
  if (!stripe) return

  const name = doc.title ?? doc.name ?? 'Product'
  const priceEur: number = doc[priceField] ?? doc.bundlePrice ?? 0

  try {
    if (!doc.stripeProductId) {
      // Create Stripe product + price
      const product = await stripe.products.create({
        name,
        metadata: { payloadCollection: collection, payloadId: doc.id },
      })
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(priceEur * 100),
        currency: 'eur',
      })
      await payload.update({
        collection,
        id: doc.id,
        data: { stripeProductId: product.id, stripePriceId: price.id } as any,
      })
    } else if (previousDoc && priceEur !== (previousDoc[priceField] ?? previousDoc.bundlePrice ?? 0)) {
      // Price changed: create the new price and persist it FIRST, so a crash/error
      // never leaves the record pointing at a price we're about to deactivate.
      const oldPriceId = doc.stripePriceId
      const price = await stripe.prices.create({
        product: doc.stripeProductId,
        unit_amount: Math.round(priceEur * 100),
        currency: 'eur',
      })
      await payload.update({ collection, id: doc.id, data: { stripePriceId: price.id } as any })
      if (oldPriceId) {
        await stripe.prices.update(oldPriceId, { active: false }).catch((e) => {
          console.error(`Failed to deactivate old Stripe price ${oldPriceId} for ${collection}/${doc.id}:`, e)
        })
      }
    } else if (previousDoc && name !== (previousDoc.title ?? previousDoc.name)) {
      // Name changed: update product
      await stripe.products.update(doc.stripeProductId, { name }).catch(() => {})
    }
  } catch (e) {
    console.error(`Stripe product sync failed for ${collection}/${doc?.id}:`, e)
  }
}
