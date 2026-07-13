import { getPayload } from 'payload'
import config from '@payload-config'
import { escapeHtml } from '@/lib/escape-html'

type BasePayload = ReturnType<typeof getPayload> extends Promise<infer T> ? T : never

async function getReminderScheduleDays(payload: BasePayload, doc: any, collection: 'orders' | 'registrations'): Promise<number[]> {
  try {
    let bookable: { collection: string; id: string } | null = null
    if (collection === 'registrations') {
      const relId = (rel: any) => (typeof rel === 'string' ? rel : rel?.id)
      if (doc.trip) bookable = { collection: 'trips', id: relId(doc.trip) }
      else if (doc.program) bookable = { collection: 'programs', id: relId(doc.program) }
      else if (doc.destination) bookable = { collection: 'destinations', id: relId(doc.destination) }
    } else {
      const item = (doc.items ?? []).find((i: any) => ['trip', 'program', 'destination'].includes(i.itemType))
      if (item) {
        const relId = (rel: any) => (typeof rel === 'string' ? rel : rel?.id)
        const collectionMap: Record<string, string> = { trip: 'trips', program: 'programs', destination: 'destinations' }
        const id = relId(item[item.itemType])
        if (id) bookable = { collection: collectionMap[item.itemType], id }
      }
    }
    if (!bookable) return [7, 0]
    const record = await payload.findByID({ collection: bookable.collection as any, id: bookable.id }).catch(() => null)
    const schedule = (record as any)?.reminderScheduleDays as Array<{ daysBefore: number }> | undefined
    if (!schedule?.length) return [7, 0]
    return schedule.map((s) => s.daysBefore)
  } catch {
    return [7, 0]
  }
}

// Run daily — sends payment reminder emails per the trip/program/destination's configured reminder schedule
export async function runBalanceReminders() {
  const payload = await getPayload({ config })
  const { stripe } = await import('@/lib/stripe')
  if (!stripe) return
  const { resend } = await import('@/lib/resend')
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'
  const now = new Date()

  for (const collection of ['orders', 'registrations'] as const) {
    // Legacy 2-tier deposit flow
    const depositDocs = await payload.find({
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

    for (const doc of depositDocs.docs as any[]) {
      if (!doc.remainingDueDate || !doc.email) continue
      const dueDate = new Date(doc.remainingDueDate)
      const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      const send7d = daysUntilDue === 7 && !doc.reminderSent7d
      const send1d = daysUntilDue === 1 && !doc.reminderSent1d

      if (!send7d && !send1d) continue

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

      const safeFirstName = escapeHtml(String(doc.firstName ?? ''))
      const dueDateStr = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      await resend.emails.send({
        from,
        to: doc.email,
        subject: `Reminder: €${doc.remainingBalance.toFixed(2)} balance due ${daysUntilDue === 1 ? 'tomorrow' : 'in 7 days'}`,
        html: `<p>Hi ${safeFirstName},</p><p>Your remaining balance of <strong>€${doc.remainingBalance.toFixed(2)}</strong> is due on <strong>${dueDateStr}</strong>. <a href="${paymentUrl}">Pay now</a></p>`,
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

    // Installment plans — per-row, configurable reminder schedule
    const installmentDocs = await payload.find({
      collection,
      where: {
        and: [
          { paymentMode: { equals: 'installments' } },
          { status: { not_equals: 'paid' } },
        ],
      },
      limit: 100,
    })

    for (const doc of installmentDocs.docs as any[]) {
      if (!doc.email) continue
      const installments = (doc.installments ?? []) as any[]
      if (installments.length === 0) continue

      const scheduleDays = await getReminderScheduleDays(payload, doc, collection)
      let mutated = false

      for (let i = 0; i < installments.length; i++) {
        const row = installments[i]
        if (row.status !== 'pending' || !row.dueDate) continue
        const dueDate = new Date(row.dueDate)
        const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        const remindersSent: number[] = (row.remindersSent ?? []).map((r: any) => (typeof r === 'number' ? r : r.daysBefore))

        const dueOffset = scheduleDays.find((d) => d === daysUntilDue)
        if (dueOffset == null || remindersSent.includes(dueOffset)) continue

        let paymentUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`
        try {
          const link = await (stripe.paymentLinks.create as any)({
            line_items: [{
              price_data: {
                currency: 'eur',
                product_data: { name: `${row.label} — Sons of Mountains` },
                unit_amount: Math.round(row.amount * 100),
              },
              quantity: 1,
            }],
            metadata: { balanceForCollection: collection, balanceForId: doc.id, installmentIndex: String(i) },
          })
          paymentUrl = link.url
        } catch {}

        const safeFirstName = escapeHtml(String(doc.firstName ?? ''))
        const dueDateStr = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        await resend.emails.send({
          from,
          to: doc.email,
          subject: `Reminder: €${row.amount.toFixed(2)} ${row.label} due ${dueOffset === 0 ? 'today' : `in ${dueOffset} days`}`,
          html: `<p>Hi ${safeFirstName},</p><p>Your ${escapeHtml(row.label)} of <strong>€${row.amount.toFixed(2)}</strong> is due on <strong>${dueDateStr}</strong>. <a href="${paymentUrl}">Pay now</a></p>`,
        }).catch(() => {})

        installments[i] = { ...row, remindersSent: [...remindersSent, dueOffset].map((d) => ({ daysBefore: d })) }
        mutated = true
      }

      if (mutated) {
        await payload.update({ collection, id: doc.id, data: { installments } as any })
      }
    }
  }
}
