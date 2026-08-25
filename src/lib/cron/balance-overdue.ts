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

function buildOverdueHtml(opts: {
  firstName?: string
  amount: number
  dueDate: string
  paymentUrl: string
  orderNumber: string
  itemTitle: string
}): string {
  const name = escapeHtml(opts.firstName || '') || 'приключенецо'
  const safeItemTitle = escapeHtml(opts.itemTitle)
  const safeOrderNumber = escapeHtml(opts.orderNumber)
  const formattedAmount = opts.amount.toFixed(2)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Просрочено плащане — Sons of Mountains</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#f0f0f0;-webkit-font-smoothing:antialiased;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Brand Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px 0;">Sons of Mountains</p>
      <h1 style="color:#ffffff;font-size:24px;font-weight:300;letter-spacing:0.5px;margin:0;">Просрочено плащане по резервация</h1>
    </div>

    <!-- Main Card -->
    <div style="background:#121212;border:1px solid #3d1a1a;border-radius:8px;padding:28px 24px;margin-bottom:24px;">
      <div style="display:inline-block;background:#3b1111;color:#ff6b6b;border:1px solid #7a2222;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:16px;">
        Внимание: Срокът за плащане е изтекъл
      </div>
      
      <p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 20px 0;">
        Здравей, <strong>${name}</strong>!<br/>
        Срокът за финално плащане на остатъка по резервацията за <strong>${safeItemTitle}</strong> е изтекъл на <strong>${escapeHtml(opts.dueDate)}</strong>.<br/><br/>
        За да не бъде освободено мястото ти в групата, моля извърши плащането възможно най-скоро.
      </p>

      <!-- Payment Details Box -->
      <div style="background:#1a1a1a;border:1px solid #333333;border-radius:6px;padding:18px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #292929;padding-bottom:10px;">
          <span style="color:#888;font-size:13px;">Номер на поръчка:</span>
          <span style="color:#fff;font-size:13px;font-family:monospace;font-weight:600;">#${safeOrderNumber}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #292929;padding-bottom:10px;">
          <span style="color:#888;font-size:13px;">Изтекъл срок:</span>
          <span style="color:#ff6b6b;font-size:13px;font-weight:600;">${escapeHtml(opts.dueDate)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:4px;">
          <span style="color:#fff;font-size:15px;font-weight:600;">Дължима сума:</span>
          <span style="color:#ffffff;font-size:18px;font-weight:700;">€${formattedAmount} EUR</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:30px 0 16px 0;">
        <a href="${opts.paymentUrl}" style="display:inline-block;width:100%;box-sizing:border-box;background:#e05a2b;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;text-align:center;padding:14px 24px;border-radius:6px;letter-spacing:0.3px;">
          Плати просрочената сума онлайн — €${formattedAmount}
        </a>
      </div>
      <p style="color:#777;font-size:12px;text-align:center;margin:8px 0 0 0;">
        Сигурно плащане през Stripe. Балансът се обновява веднага.
      </p>
    </div>

    <!-- Help & Footer -->
    <div style="text-align:center;margin-top:24px;color:#555;font-size:12px;line-height:1.5;">
      <p style="margin:0 0 8px 0;">Ако имаш затруднения с плащането, свържи се директно с нас.</p>
      <p style="margin:0;">Sons of Mountains &middot; Adventure awaits</p>
    </div>
  </div>
</body>
</html>`
}

export async function runBalanceOverdue() {
  const payload = await getPayload({ config })
  const { stripe } = await import('@/lib/stripe')
  const now = new Date().toISOString()

  for (const collection of ['orders', 'registrations'] as const) {
    const docs = await payload.find({
      collection,
      where: {
        and: [
          { status: { not_in: ['cancelled', 'refunded'] } },
          { paymentMode: { in: ['deposit', 'installments'] } },
          { remainingBalance: { greater_than: 0 } },
          { remainingDueDate: { less_than: now } },
          { reminderSent1d: { not_equals: true } },
        ],
      } as any,
      limit: 100,
      depth: 2,
    })

    for (const doc of docs.docs as any[]) {
      if (!doc.email) continue
      const itemTitle = getDocItemTitle(doc, collection)
      const dueDate = doc.remainingDueDate ? new Date(doc.remainingDueDate) : new Date()
      const dueDateStr = dueDate.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })

      let paymentUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/shop`
      if (stripe) {
        try {
          const link = await (stripe.paymentLinks.create as any)({
            line_items: [{
              price_data: {
                currency: 'eur',
                product_data: { name: `Просрочен остатък по #${doc.id} (${itemTitle}) — Sons of Mountains` },
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
          console.error('[balance-overdue] Error creating stripe payment link:', e)
        }
      }

      const trigger = collection === 'orders' ? 'order_balance_due_1d' : 'registration_balance_overdue'
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
        const subject = `ВАЖНО: Просрочено плащане (€${doc.remainingBalance.toFixed(2)}) — Резервация #${doc.id} | Sons of Mountains`
        const html = buildOverdueHtml({
          firstName: doc.firstName,
          amount: doc.remainingBalance,
          dueDate: dueDateStr,
          paymentUrl,
          orderNumber: String(doc.id),
          itemTitle,
        })

        try {
          const resend = getResend()
          const result = await resend.emails.send({
            from: FROM,
            to: doc.email,
            subject,
            html,
          })

          await createEmailLog(payload, {
            trigger,
            recipient: doc.email,
            subject,
            status: result.error ? 'failed' : 'sent',
            resendMessageId: result.data?.id,
            sentAt: new Date().toISOString(),
            error: result.error ? result.error.message : undefined,
            html,
            context: { [collection === 'orders' ? 'orderId' : 'registrationId']: String(doc.id) },
          })
        } catch (err: any) {
          console.error(`[balance-overdue] Direct resend failed:`, err?.message || err)
        }
      }

      await payload.update({
        collection,
        id: doc.id,
        data: {
          reminderSent1d: true,
          stripePaymentLinkId: paymentUrl.startsWith('http') ? paymentUrl : undefined,
        } as any,
      })
    }
  }
}

