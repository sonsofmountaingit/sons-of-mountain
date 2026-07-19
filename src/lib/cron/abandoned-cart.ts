import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

function cartContext(cart: any) {
  const items = cart.cartData?.items ?? []
  const cartItems = items.map((i: any) => `<li>${String(i.title)} — €${(i.unitPrice * i.quantity).toFixed(2)}</li>`).join('')
  const cartTotal = items.reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0)
  return { items, cartItems, cartTotal, cartUrl: `${SITE}/shop/checkout` }
}

export async function processAbandonedCarts() {
  const payload = await getPayload({ config })
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const carts1h = await payload.find({
    collection: 'abandoned-carts',
    where: {
      and: [
        { status: { equals: 'active' } },
        { emailSentAt: { exists: false } },
        { email: { exists: true } },
        { updatedAt: { less_than: oneHourAgo } },
      ],
    },
    limit: 50,
  })

  for (const cart of carts1h.docs as any[]) {
    if (!cart.email) continue
    const { items, cartItems, cartTotal, cartUrl } = cartContext(cart)
    if (!items.length) continue

    try {
      await sendFlow('abandoned_cart_1h', { email: cart.email, firstName: cart.customer?.name }, { cartItems, cartTotal, cartUrl }, payload)
      await payload.update({ collection: 'abandoned-carts', id: cart.id, data: { emailSentAt: new Date().toISOString() } })
    } catch {}
  }

  const carts24h = await payload.find({
    collection: 'abandoned-carts',
    where: {
      and: [
        { status: { equals: 'active' } },
        { emailSentAt: { exists: true } },
        { email: { exists: true } },
        { updatedAt: { less_than: twentyFourHoursAgo } },
      ],
    },
    limit: 50,
  })

  for (const cart of carts24h.docs as any[]) {
    if (!cart.email) continue
    const { items, cartItems, cartTotal, cartUrl } = cartContext(cart)
    if (!items.length) continue

    try {
      await sendFlow('abandoned_cart_24h', { email: cart.email, firstName: cart.customer?.name }, { cartItems, cartTotal, cartUrl }, payload)
    } catch {}
  }

  // Expire carts older than 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const old = await payload.find({
    collection: 'abandoned-carts',
    where: { and: [{ status: { equals: 'active' } }, { updatedAt: { less_than: sevenDaysAgo } }] },
    limit: 100,
  })
  for (const cart of old.docs) {
    await payload.update({ collection: 'abandoned-carts', id: cart.id, data: { status: 'expired' } })
  }
}
