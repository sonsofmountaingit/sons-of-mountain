import type { BasePayload } from 'payload'

async function getStripe() {
  const { stripe } = await import('@/lib/stripe')
  return stripe
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
