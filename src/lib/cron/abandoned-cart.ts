import { getPayload } from 'payload'
import config from '@payload-config'
import { getResend } from '@/lib/resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'
const SITE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export async function processAbandonedCarts() {
  const payload = await getPayload({ config })
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const carts = await payload.find({
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

  for (const cart of carts.docs) {
    if (!(cart as any).email) continue

    const items = (cart as any).cartData?.items ?? []
    if (!items.length) continue

    try {
      const itemList = items.map((i: any) => `<li>${i.title} — €${(i.unitPrice * i.quantity).toFixed(2)}</li>`).join('')
      const total = items.reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0)

      await getResend().emails.send({
        from: FROM,
        to: (cart as any).email,
        subject: 'You left something behind',
        html: `
          <h2>Your adventure is waiting</h2>
          <p>You left items in your cart. Complete your booking before spots run out.</p>
          <ul>${itemList}</ul>
          <p><strong>Total: €${total.toFixed(2)}</strong></p>
          <a href="${SITE}/shop/checkout" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:16px;">Complete booking</a>
        `,
      })

      await payload.update({
        collection: 'abandoned-carts',
        id: cart.id,
        data: { emailSentAt: new Date().toISOString() },
      })
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
