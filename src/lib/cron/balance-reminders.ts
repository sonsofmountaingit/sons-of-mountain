import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'
import { escapeHtml } from '@/lib/escape-html'
import { getResend, FROM } from '@/lib/resend'
import { createEmailLog } from '@/lib/email-logger'

type BasePayload = ReturnType<typeof getPayload> extends Promise<infer T> ? T : never

function getDocItemTitle(doc: any, collection: 'orders' | 'registrations'): string {
  if (collection === 'registrations') {
    const rel = doc.trip ?? doc.program ?? doc.destination
    if (typeof rel === 'object' && rel) {
      return rel.title ?? rel.name ?? 'Sons of Mountains Adventure'
    }
    return 'Sons of Mountains Adventure'
  }
  const items = (doc.items ?? []) as any[]
  const titles = items.map((i) => {
    const rel = i.trip ?? i.program ?? i.destination ?? i.product ?? i.bundle
    if (typeof rel === 'object' && rel) {
      return rel.title ?? rel.name
    }
    return null
  }).filter(Boolean)
  return titles.length > 0 ? titles.join(', ') : 'Sons of Mountains Adventure'
}

function buildBalanceReminderHtml(opts: {
  firstName?: string
  amount: number
  dueDate: string
  paymentUrl: string
  orderNumber: string
  itemTitle: string
  label?: string
  isUrgent?: boolean
}): string {
  const name = escapeHtml(opts.firstName || '') || 'приключенецо'
  const safeItemTitle = escapeHtml(opts.itemTitle)
  const safeLabel = escapeHtml(opts.label || 'Остатък по резервация')
  const safeOrderNumber = escapeHtml(opts.orderNumber)
  const formattedAmount = opts.amount.toFixed(2)
  const urgencyBadge = opts.isUrgent
    ? `<div style="display:inline-block;background:#3b1111;color:#ff6b6b;border:1px solid #7a2222;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:16px;">Краен срок: скоро изтича</div>`
    : `<div style="display:inline-block;background:#182618;color:#5cd65c;border:1px solid #234d23;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:16px;">Напомняне за плащане</div>`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Напомняне за плащане — Sons of Mountains</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#f0f0f0;-webkit-font-smoothing:antialiased;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Brand Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px 0;">Sons of Mountains</p>
      <h1 style="color:#ffffff;font-size:24px;font-weight:300;letter-spacing:0.5px;margin:0;">${opts.isUrgent ? 'Срок за плащане на вноска' : 'Предстоящо плащане по резервация'}</h1>
    </div>

    <!-- Main Card -->
    <div style="background:#121212;border:1px solid #262626;border-radius:8px;padding:28px 24px;margin-bottom:24px;">
      ${urgencyBadge}
      
      <p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 20px 0;">
        Здравей, <strong>${name}</strong>!<br/>
        Напомняме ти за дължимото плащане за <strong>${safeItemTitle}</strong>. За да гарантираш своето място в групата, моля завърши плащането преди крайния срок.
      </p>

      <!-- Payment Breakdown Box -->
      <div style="background:#1a1a1a;border:1px solid #333333;border-radius:6px;padding:18px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #292929;padding-bottom:10px;">
          <span style="color:#888;font-size:13px;">Номер на поръчка:</span>
          <span style="color:#fff;font-size:13px;font-family:monospace;font-weight:600;">#${safeOrderNumber}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #292929;padding-bottom:10px;">
          <span style="color:#888;font-size:13px;">Вид плащане:</span>
          <span style="color:#fff;font-size:13px;font-weight:500;">${safeLabel}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #292929;padding-bottom:10px;">
          <span style="color:#888;font-size:13px;">Краен срок:</span>
          <span style="color:#ffb84d;font-size:13px;font-weight:600;">${escapeHtml(opts.dueDate)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:4px;">
          <span style="color:#fff;font-size:15px;font-weight:600;">Дължима сума:</span>
          <span style="color:#ffffff;font-size:18px;font-weight:700;">€${formattedAmount} EUR</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:30px 0 16px 0;">
        <a href="${opts.paymentUrl}" style="display:inline-block;width:100%;box-sizing:border-box;background:#ffffff;color:#0a0a0a;font-size:15px;font-weight:700;text-decoration:none;text-align:center;padding:14px 24px;border-radius:6px;letter-spacing:0.3px;">
          Плати онлайн сега — €${formattedAmount}
        </a>
      </div>
      <p style="color:#777;font-size:12px;text-align:center;margin:8px 0 0 0;">
        Сигурно и бързо плащане с карта чрез Stripe. Балансът се обновява автоматично.
      </p>
    </div>

    <!-- Help & Footer -->
    <div style="text-align:center;margin-top:24px;color:#555;font-size:12px;line-height:1.5;">
      <p style="margin:0 0 8px 0;">Имаш въпроси? Отговори директно на този имейл или ни пиши.</p>
      <p style="margin:0;">Sons of Mountains &middot; Adventure awaits</p>
    </div>
  </div>
</body>
</html>`
}

async function sendTransactionalBalanceEmail(opts: {
  to: string
  firstName?: string
  amount: number
  dueDate: string
  paymentUrl: string
  orderNumber: string
  itemTitle: string
  label?: string
  isUrgent?: boolean
  payload: BasePayload
  collection: 'orders' | 'registrations'
  docId: string
  trigger: string
}) {
  const subject = opts.isUrgent
    ? `ВАЖНО: Срок за плащане на вноска (€${opts.amount.toFixed(2)}) — Поръчка #${opts.orderNumber} | Sons of Mountains`
    : `Напомняне за плащане на вноска (€${opts.amount.toFixed(2)}) — Поръчка #${opts.orderNumber} | Sons of Mountains`

  const html = buildBalanceReminderHtml(opts)

  try {
    const resend = getResend()
    const result = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject,
      html,
    })

    await createEmailLog(opts.payload, {
      trigger: opts.trigger,
      recipient: opts.to,
      subject,
      status: result.error ? 'failed' : 'sent',
      resendMessageId: result.data?.id,
      sentAt: new Date().toISOString(),
      error: result.error ? result.error.message : undefined,
      html,
      context: { [opts.collection === 'orders' ? 'orderId' : 'registrationId']: opts.docId },
    })
  } catch (err: any) {
    console.error(`[balance-reminders] Failed to send transactional email to ${opts.to}:`, err?.message || err)
    await createEmailLog(opts.payload, {
      trigger: opts.trigger,
      recipient: opts.to,
      subject,
      status: 'failed',
      error: String(err?.message || err),
      context: { [opts.collection === 'orders' ? 'orderId' : 'registrationId']: opts.docId },
    }).catch(() => {})
  }
}

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
    if (!bookable) return [7, 1]
    const record = await payload.findByID({ collection: bookable.collection as any, id: bookable.id }).catch(() => null)
    const schedule = (record as any)?.reminderScheduleDays as Array<{ daysBefore: number }> | undefined
    if (!schedule?.length) return [7, 1]
    return schedule.map((s) => s.daysBefore)
  } catch {
    return [7, 1]
  }
}

// Run daily — sends payment reminder emails per the trip/program/destination's configured reminder schedule
export async function runBalanceReminders() {
  const payload = await getPayload({ config })
  const { stripe } = await import('@/lib/stripe')
  if (!stripe) return
  const now = new Date()

  for (const collection of ['orders', 'registrations'] as const) {
    // 2-tier deposit flow: query orders/registrations with remaining balance
    const depositDocs = await payload.find({
      collection,
      where: {
        and: [
          { paymentMode: { equals: 'deposit' } },
          { remainingBalance: { greater_than: 0 } },
        ],
      },
      limit: 100,
      depth: 2,
    })

    for (const doc of depositDocs.docs as any[]) {
      if (doc.status === 'cancelled' || doc.status === 'refunded') continue
      if (!doc.remainingDueDate || !doc.email) continue
      const dueDate = new Date(doc.remainingDueDate)
      const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      const send7d = (daysUntilDue <= 7 && daysUntilDue > 1) && !doc.reminderSent7d
      const send1d = daysUntilDue <= 1 && !doc.reminderSent1d

      if (!send7d && !send1d) continue

      const itemTitle = getDocItemTitle(doc, collection)
      let paymentUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/shop`
      try {
        const link = await (stripe.paymentLinks.create as any)({
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: { name: `Остатък по поръчка #${doc.id} (${itemTitle}) — Sons of Mountains` },
              unit_amount: Math.round(doc.remainingBalance * 100),
            },
            quantity: 1,
          }],
          metadata: {
            balanceForCollection: collection,
            balanceForId: String(doc.id),
          },
          payment_intent_data: {
            metadata: {
              balanceForCollection: collection,
              balanceForId: String(doc.id),
            },
          },
        })
        paymentUrl = link.url
      } catch (e) {
        console.error('[balance-reminders] Error creating stripe payment link:', e)
      }

      const dueDateStr = dueDate.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
      const trigger = collection === 'orders'
        ? (send1d ? 'order_balance_due_1d' : 'order_balance_due_7d')
        : (send1d ? 'registration_balance_due_1d' : 'registration_balance_due_7d')

      let sent = false
      try {
        const res = await sendFlow(trigger, { email: doc.email, firstName: doc.firstName }, {
          remainingBalance: doc.remainingBalance,
          remainingDueDate: dueDateStr,
          invoiceUrl: paymentUrl,
          orderNumber: String(doc.id),
        }, payload)
        sent = res.sent
      } catch {}

      if (!sent) {
        await sendTransactionalBalanceEmail({
          to: doc.email,
          firstName: doc.firstName,
          amount: doc.remainingBalance,
          dueDate: dueDateStr,
          paymentUrl,
          orderNumber: String(doc.id),
          itemTitle,
          label: 'Остатък от плащане',
          isUrgent: send1d || daysUntilDue <= 1,
          payload,
          collection,
          docId: String(doc.id),
          trigger,
        })
      }

      await payload.update({
        collection,
        id: doc.id,
        data: {
          ...(send7d ? { reminderSent7d: true } : {}),
          ...(send1d ? { reminderSent1d: true } : {}),
          stripePaymentLinkId: paymentUrl.startsWith('http') ? paymentUrl : undefined,
        } as any,
      })
    }

    // Installment plans — per-row, configurable reminder schedule
    const installmentDocs = await payload.find({
      collection,
      where: {
        paymentMode: { equals: 'installments' },
      },
      limit: 100,
      depth: 2,
    })

    for (const doc of installmentDocs.docs as any[]) {
      if (doc.status === 'cancelled' || doc.status === 'refunded') continue
      if (!doc.email) continue
      const installments = (doc.installments ?? []) as any[]
      if (installments.length === 0) continue

      const scheduleDays = await getReminderScheduleDays(payload, doc, collection)
      const itemTitle = getDocItemTitle(doc, collection)
      let mutated = false

      for (let i = 0; i < installments.length; i++) {
        const row = installments[i]
        if (row.status !== 'pending' || !row.dueDate) continue
        const dueDate = new Date(row.dueDate)
        const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        const remindersSent: number[] = (row.remindersSent ?? []).map((r: any) => (typeof r === 'number' ? r : r.daysBefore))

        const dueOffset = scheduleDays.find((d) => d === daysUntilDue) ?? (daysUntilDue <= 1 && !remindersSent.includes(1) ? 1 : (daysUntilDue <= 7 && !remindersSent.includes(7) ? 7 : null))
        if (dueOffset == null || remindersSent.includes(dueOffset)) continue

        let paymentUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/shop`
        try {
          const link = await (stripe.paymentLinks.create as any)({
            line_items: [{
              price_data: {
                currency: 'eur',
                product_data: { name: `Вноска "${row.label}" по поръчка #${doc.id} (${itemTitle}) — Sons of Mountains` },
                unit_amount: Math.round(row.amount * 100),
              },
              quantity: 1,
            }],
            metadata: {
              balanceForCollection: collection,
              balanceForId: String(doc.id),
              installmentIndex: String(i),
            },
            payment_intent_data: {
              metadata: {
                balanceForCollection: collection,
                balanceForId: String(doc.id),
                installmentIndex: String(i),
              },
            },
          })
          paymentUrl = link.url
        } catch (e) {
          console.error('[balance-reminders] Error creating installment stripe link:', e)
        }

        const dueDateStr = dueDate.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
        const trigger = collection === 'orders'
          ? (dueOffset <= 1 ? 'order_balance_due_1d' : 'order_balance_due_7d')
          : (dueOffset <= 1 ? 'registration_balance_due_1d' : 'registration_balance_due_7d')

        let sent = false
        try {
          const res = await sendFlow(trigger, { email: doc.email, firstName: doc.firstName }, {
            remainingBalance: row.amount,
            remainingDueDate: dueDateStr,
            invoiceUrl: paymentUrl,
            orderNumber: String(doc.id),
          }, payload)
          sent = res.sent
        } catch {}

        if (!sent) {
          await sendTransactionalBalanceEmail({
            to: doc.email,
            firstName: doc.firstName,
            amount: row.amount,
            dueDate: dueDateStr,
            paymentUrl,
            orderNumber: String(doc.id),
            itemTitle,
            label: row.label || `Вноска ${i + 1}`,
            isUrgent: dueOffset <= 1,
            payload,
            collection,
            docId: String(doc.id),
            trigger,
          })
        }

        installments[i] = { ...row, remindersSent: [...remindersSent, dueOffset].map((d) => ({ daysBefore: d })) }
        mutated = true
      }

      if (mutated) {
        await payload.update({ collection, id: doc.id, data: { installments } as any })
      }
    }
  }
}

