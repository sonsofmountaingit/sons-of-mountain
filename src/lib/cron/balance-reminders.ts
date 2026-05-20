import { getPayload } from 'payload'
import config from '@payload-config'

// Run daily — sends payment reminder emails 7 days and 1 day before remainingDueDate
export async function runBalanceReminders() {
  const payload = await getPayload({ config })
  const { stripe } = await import('@/lib/stripe')
  if (!stripe) return
  const { resend } = await import('@/lib/resend')
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'
  const now = new Date()

  for (const collection of ['orders', 'registrations'] as const) {
    const docs = await payload.find({
      collection,
      where: {
        and: [
          { paymentMode: { equals: 'deposit' } },
          { status: { not_equals: 'paid' } },
          { remainingBalance: { greater_than: 0 } },
        ],
      },
      limit: 100,
    })

    for (const doc of docs.docs as any[]) {
      if (!doc.remainingDueDate || !doc.email) continue
      const dueDate = new Date(doc.remainingDueDate)
      const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      const send7d = daysUntilDue === 7 && !doc.reminderSent7d
      const send1d = daysUntilDue === 1 && !doc.reminderSent1d

      if (!send7d && !send1d) continue

      // Generate a one-off payment link for the remaining amount
      let paymentUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`
      try {
        const link = await (stripe.paymentLinks.create as any)({
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: { name: 'Balance Payment — Sons of Mountains' },
              unit_amount: Math.round(doc.remainingBalance * 100),
            },
            quantity: 1,
          }],
          metadata: { balanceForCollection: collection, balanceForId: doc.id },
        })
        paymentUrl = link.url
      } catch {}

      const dueDateStr = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      await resend.emails.send({
        from,
        to: doc.email,
        subject: `Reminder: €${doc.remainingBalance.toFixed(2)} balance due ${daysUntilDue === 1 ? 'tomorrow' : 'in 7 days'}`,
        html: `<p>Hi ${doc.firstName ?? ''},</p><p>Your remaining balance of <strong>€${doc.remainingBalance.toFixed(2)}</strong> is due on <strong>${dueDateStr}</strong>. <a href="${paymentUrl}">Pay now</a></p>`,
      }).catch(() => {})

      await payload.update({
        collection,
        id: doc.id,
        data: {
          ...(send7d ? { reminderSent7d: true } : {}),
          ...(send1d ? { reminderSent1d: true } : {}),
        } as any,
      })
    }
  }
}
