import type Stripe from 'stripe'
import type { BasePayload } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { escapeHtml } from '@/lib/escape-html'
import { sendGa4Refund, sendGa4Purchase } from '@/lib/ga4-measurement-protocol'

function ga4ItemTitle(item: any): string {
  return (
    item.trip?.title ??
    item.product?.title ??
    item.program?.title ??
    item.destination?.name ??
    item.bundle?.title ??
    'Product'
  )
}

async function getStripe() {
  const { stripe } = await import('@/lib/stripe')
  return stripe!
}

async function creditLoyaltyPoints(payload: BasePayload, customerId: string | null | undefined, amountEur: number) {
  if (!customerId) return
  try {
    const shopSettings = await payload.findGlobal({ slug: 'shop' }).catch(() => null)
    const rate = (shopSettings as any)?.loyaltyPointsPerEur ?? 1
    const pointsToAdd = Math.floor(amountEur * rate)
    if (pointsToAdd <= 0) return
    const cust = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
    if (!cust) return
    const newPoints = ((cust as any).loyaltyPoints ?? 0) + pointsToAdd
    const tier = newPoints >= 5000 ? 'platinum' : newPoints >= 1500 ? 'gold' : newPoints >= 500 ? 'silver' : 'bronze'
    const oldTier = (cust as any).loyaltyTier ?? 'bronze'
    await payload.update({ collection: 'customers', id: customerId, data: { loyaltyPoints: newPoints, loyaltyTier: tier } })
    if (tier !== oldTier) {
      const { sendFlow } = await import('@/lib/email-flows')
      await sendFlow('loyalty_tier_upgrade', { email: (cust as any).email, firstName: (cust as any).firstName }, {
        loyaltyTier: tier,
        previousTier: oldTier,
        loyaltyPoints: newPoints,
        loyaltyTierLabel: tier.charAt(0).toUpperCase() + tier.slice(1),
      }, payload).catch(() => {})
    }
  } catch {}
}

export async function notifyWaitlist(payload: BasePayload, itemType: string, itemId: string) {
  try {
    const next = await payload.find({
      collection: 'waitlist',
      where: { and: [{ itemType: { equals: itemType } }, { [itemType]: { equals: itemId } }, { status: { equals: 'waiting' } }] },
      sort: 'position',
      limit: 3,
      depth: 1,
    })
    for (const entry of next.docs) {
      const { sendFlow } = await import('@/lib/email-flows')
      const { waitlistItemTitle } = await import('@/lib/featured-content')
      await sendFlow('waitlist_spot_available', { email: (entry as any).email, firstName: (entry as any).name }, {
        itemTitle: waitlistItemTitle(entry),
        bookNowUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop`,
        waitlistPosition: (entry as any).position,
      }, payload).catch(() => {})
      await payload.update({ collection: 'waitlist', id: entry.id, data: { status: 'notified', notifiedAt: new Date().toISOString() } })
    }
  } catch {}
}

type OrderItemDetail = {
  itemType: string
  title: string
  quantity: number
  unitPrice: number
  startDate?: string | null
  endDate?: string | null
  location?: string | null
  participantDetails?: { name?: string | null; email?: string | null; dietary?: string | null }[]
  variantLabel?: string | null
  voucherCode?: string | null
  voucherRecipientName?: string | null
  voucherRecipientEmail?: string | null
  voucherMessage?: string | null
}

function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate) return ''
  const start = new Date(startDate).toLocaleDateString('bg-BG')
  const end = endDate ? new Date(endDate).toLocaleDateString('bg-BG') : null
  return end && end !== start ? `${start} — ${end}` : start
}

function buildItemMetaLines(item: OrderItemDetail, opts: { includeParticipants: boolean }): string[] {
  const lines: string[] = []
  if (item.itemType === 'trip' || item.itemType === 'destination' || item.itemType === 'program') {
    const dateRange = formatDateRange(item.startDate, item.endDate)
    if (dateRange) lines.push(dateRange)
    if (item.location) lines.push(escapeHtml(item.location))
    if (opts.includeParticipants && item.participantDetails?.length) {
      for (const participant of item.participantDetails) {
        if (!participant?.name && !participant?.email) continue
        const bits = [participant.name, participant.email].filter((v): v is string => Boolean(v)).map(escapeHtml).join(' — ')
        const dietary = participant.dietary ? ` (${escapeHtml(participant.dietary)})` : ''
        lines.push(`Участник: ${bits}${dietary}`)
      }
    }
  }
  if (item.itemType === 'product' && item.variantLabel) {
    lines.push(`Вариант: ${escapeHtml(item.variantLabel)}`)
  }
  if (item.itemType === 'gift-voucher') {
    if (item.voucherCode) lines.push(`Код: ${escapeHtml(item.voucherCode)}`)
    if (item.voucherRecipientName || item.voucherRecipientEmail) {
      const bits = [item.voucherRecipientName, item.voucherRecipientEmail].filter((v): v is string => Boolean(v)).map(escapeHtml).join(' — ')
      lines.push(`За: ${bits}`)
    }
    if (item.voucherMessage) lines.push(`Съобщение: ${escapeHtml(item.voucherMessage)}`)
  }
  return lines
}

function buildAdminOrderNotificationHtml(p: {
  orderId: string
  orderNumber: string
  customerEmail: string
  firstName: string
  phone?: string | null
  items: OrderItemDetail[]
  total: number
  currency: string
  paymentMode: string
  shippingAddress?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postalCode?: string | null; country?: string | null } | null
}) {
  const rows = p.items
    .map((item) => {
      const meta = buildItemMetaLines(item, { includeParticipants: true })
      const metaHtml = meta.length
        ? `<div style="color:#666;font-size:12px;line-height:1.5;margin-top:2px">${meta.join('<br/>')}</div>`
        : ''
      return `<tr><td style="padding:8px 0;font-size:14px;color:#333;vertical-align:top">${escapeHtml(item.title)} &times; ${item.quantity}${metaHtml}</td><td style="padding:8px 0;font-size:14px;color:#333;text-align:right;vertical-align:top">&#x20AC;${(item.unitPrice * item.quantity).toFixed(2)}</td></tr>`
    })
    .join('')
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  const adminUrl = siteUrl ? `${siteUrl}/admin/collections/orders/${p.orderId}` : ''

  const hasPhysical = p.items.some((i) => i.itemType === 'product')
  const addr = p.shippingAddress
  const addressBlock = hasPhysical && addr && (addr.line1 || addr.city)
    ? `<tr><td style="padding:4px 0;color:#555;font-size:13px;vertical-align:top">Адрес за доставка</td><td style="padding:4px 0;text-align:right;color:#111;font-size:13px">${[addr.line1, addr.line2, addr.city, addr.state, addr.postalCode, addr.country].filter((v): v is string => Boolean(v)).map(escapeHtml).join(', ')}</td></tr>`
    : ''

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <h2 style="margin:0 0 16px 0;font-size:20px;color:#111">Нова платена поръчка</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <tr><td style="padding:4px 0;color:#555;font-size:13px">Номер на поръчка</td><td style="padding:4px 0;text-align:right;font-family:monospace;color:#111">${escapeHtml(p.orderNumber)}</td></tr>
    <tr><td style="padding:4px 0;color:#555;font-size:13px">Клиент</td><td style="padding:4px 0;text-align:right;color:#111">${escapeHtml(p.firstName)} &lt;${escapeHtml(p.customerEmail)}&gt;</td></tr>
    ${p.phone ? `<tr><td style="padding:4px 0;color:#555;font-size:13px">Телефон</td><td style="padding:4px 0;text-align:right;color:#111">${escapeHtml(p.phone)}</td></tr>` : ''}
    <tr><td style="padding:4px 0;color:#555;font-size:13px">Начин на плащане</td><td style="padding:4px 0;text-align:right;color:#111">${escapeHtml(p.paymentMode)}</td></tr>
    ${addressBlock}
  </table>
  <table style="width:100%;border-collapse:collapse;border-top:1px solid #ddd">
    ${rows}
  </table>
  <div style="display:flex;justify-content:space-between;padding-top:10px;margin-top:8px;border-top:1px solid #ddd">
    <span style="font-size:15px;font-weight:600;color:#111">Общо</span>
    <span style="font-size:15px;font-weight:600;color:#111;float:right">&#x20AC;${p.total.toFixed(2)} ${escapeHtml(p.currency)}</span>
  </div>
  ${adminUrl ? `<p style="margin:24px 0 0 0"><a href="${adminUrl}" style="color:#0a58ca;font-size:13px">Виж поръчката в администрацията &rarr;</a></p>` : ''}
</div></body></html>`
}

function buildOrderConfirmationHtml(p: {
  firstName: string
  orderNumber: string
  items: OrderItemDetail[]
  total: number
  currency: string
  paymentMode: string
  depositPaid?: number | null
  remainingBalance?: number | null
  remainingDueDate?: string | null
  nextInstallment?: { label: string; amount: number; dueDate: string } | null
}) {
  const name = escapeHtml(p.firstName) || 'adventurer'
  const rows = p.items
    .map((item) => {
      const meta = buildItemMetaLines(item, { includeParticipants: false })
      const metaHtml = meta.length
        ? `<div style="color:#888;font-size:12px;line-height:1.5;margin-top:2px">${meta.join('<br/>')}</div>`
        : ''
      return `<tr><td style="color:#ccc;font-size:14px;padding:8px 0;vertical-align:top">${escapeHtml(item.title)} &times; ${item.quantity}${metaHtml}</td><td style="color:#fff;font-size:14px;padding:8px 0;text-align:right;vertical-align:top">&#x20AC;${(item.unitPrice * item.quantity).toFixed(2)}</td></tr>`
    })
    .join('')

  let nextPaymentBlock = ''
  if (p.paymentMode === 'deposit' && p.remainingBalance != null) {
    const dueStr = p.remainingDueDate ? new Date(p.remainingDueDate).toLocaleDateString('bg-BG') : null
    nextPaymentBlock = `<div style="background:#111;border:1px solid #2a2a2a;border-radius:4px;padding:20px;margin-bottom:24px">
      <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0">Следващо плащане</p>
      <div style="display:flex;justify-content:space-between">
        <span style="color:#ccc;font-size:14px">Остатък</span>
        <span style="color:#fff;font-size:14px;font-weight:600">&#x20AC;${p.remainingBalance.toFixed(2)}</span>
      </div>
      ${dueStr ? `<p style="color:#777;font-size:12px;margin:10px 0 0 0">Ще бъде изтеглен автоматично на ${dueStr} — ще получите напомняне по имейл.</p>` : ''}
      ${p.depositPaid != null ? `<p style="color:#777;font-size:12px;margin:4px 0 0 0">Платен депозит: &#x20AC;${p.depositPaid.toFixed(2)}</p>` : ''}
    </div>`
  } else if (p.paymentMode === 'installments' && p.nextInstallment) {
    const dueStr = new Date(p.nextInstallment.dueDate).toLocaleDateString('bg-BG')
    nextPaymentBlock = `<div style="background:#111;border:1px solid #2a2a2a;border-radius:4px;padding:20px;margin-bottom:24px">
      <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0">Следваща вноска</p>
      <div style="display:flex;justify-content:space-between">
        <span style="color:#ccc;font-size:14px">${escapeHtml(p.nextInstallment.label)}</span>
        <span style="color:#fff;font-size:14px;font-weight:600">&#x20AC;${p.nextInstallment.amount.toFixed(2)}</span>
      </div>
      <p style="color:#777;font-size:12px;margin:10px 0 0 0">Ще бъде изтеглена автоматично на ${dueStr} — ще получите напомняне по имейл.</p>
    </div>`
  }

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:48px 24px">
  <div style="text-align:center;margin-bottom:48px">
    <p style="color:#555;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0">Sons of Mountains</p>
    <h1 style="color:#fff;font-size:26px;font-weight:300;letter-spacing:1px;margin:0">Готово, резервацията е потвърдена!</h1>
  </div>
  <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 24px 0">Здравей, ${name}! Плащането ти беше успешно и резервацията е потвърдена.</p>
  <div style="background:#111;border:1px solid #2a2a2a;border-radius:4px;padding:24px;margin-bottom:24px">
    <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px 0">Номер на поръчка</p>
    <p style="color:#fff;font-size:16px;font-family:monospace;margin:0 0 16px 0">${escapeHtml(p.orderNumber)}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #222">
      ${rows}
    </table>
    <div style="display:flex;justify-content:space-between;padding-top:12px;margin-top:8px;border-top:1px solid #222">
      <span style="color:#fff;font-size:15px;font-weight:600">Общо</span>
      <span style="color:#fff;font-size:15px;font-weight:600;float:right">&#x20AC;${p.total.toFixed(2)} ${escapeHtml(p.currency)}</span>
    </div>
  </div>
  ${nextPaymentBlock}
  <div style="text-align:center;margin-top:32px">
    <p style="color:#333;font-size:11px;margin:0">Sons of Mountains &middot; Adventure awaits</p>
  </div>
</div></body></html>`
}

async function sendOrderConfirmationEmail(payload: BasePayload, orderId: string) {
  const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 2 }).catch(() => null)
  if (!order) return
  const o = order as any
  if (!o.email) return

  const giftVoucher = typeof o.giftVoucher === 'object' && o.giftVoucher ? o.giftVoucher : null

  const items: OrderItemDetail[] = ((o.items ?? []) as any[]).map((item) => {
    const trip = item.trip
    const program = item.program
    const destination = item.destination
    const product = item.product
    const bundle = item.bundle
    const variant = product && item.variantId
      ? ((product.variants ?? []) as any[]).find((v) => v.id === item.variantId)
      : null

    return {
      itemType: item.itemType,
      title: trip?.title ?? product?.title ?? program?.title ?? destination?.name ?? bundle?.title ?? (item.itemType === 'gift-voucher' ? 'Подаръчен ваучер' : 'Продукт'),
      quantity: item.quantity ?? item.participantCount ?? 1,
      unitPrice: item.unitPrice ?? 0,
      startDate: trip?.startDate ?? program?.startDate ?? destination?.startDate ?? null,
      endDate: trip?.endDate ?? program?.endDate ?? destination?.endDate ?? null,
      location: trip?.location ?? destination?.location ?? null,
      participantDetails: item.participantDetails ?? [],
      variantLabel: variant ? [variant.label, variant.size, variant.color].filter(Boolean).join(' / ') : null,
      voucherCode: item.itemType === 'gift-voucher' ? giftVoucher?.code ?? null : null,
      voucherRecipientName: item.itemType === 'gift-voucher' ? giftVoucher?.recipientName ?? null : null,
      voucherRecipientEmail: item.itemType === 'gift-voucher' ? giftVoucher?.recipientEmail ?? null : null,
      voucherMessage: item.itemType === 'gift-voucher' ? giftVoucher?.message ?? null : null,
    }
  })
  const installments = (o.installments ?? []) as any[]
  const nextInstallment = installments.find((row) => row.status === 'pending') ?? null
  const shippingAddress = o.shippingAddress ?? null

  const { resend } = await import('@/lib/resend')
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'
  const html = buildOrderConfirmationHtml({
    firstName: o.firstName ?? '',
    orderNumber: String(orderId).slice(-8).toUpperCase(),
    items,
    total: o.totalAmount ?? 0,
    currency: o.currency ?? 'EUR',
    paymentMode: o.paymentMode ?? 'full',
    depositPaid: o.depositPaid,
    remainingBalance: o.remainingBalance,
    remainingDueDate: o.remainingDueDate,
    nextInstallment,
  })

  await resend.emails.send({
    from,
    to: o.email,
    subject: 'Резервацията е потвърдена — Sons of Mountains',
    html,
  }).catch(() => {})

  const settings = await payload.findGlobal({ slug: 'email-settings' }).catch(() => null)
  const adminEmail = (settings as any)?.adminEmail
  if (adminEmail) {
    const adminHtml = buildAdminOrderNotificationHtml({
      orderId: String(orderId),
      orderNumber: String(orderId).slice(-8).toUpperCase(),
      customerEmail: o.email,
      firstName: o.firstName ?? '',
      phone: o.phone ?? null,
      items,
      total: o.totalAmount ?? 0,
      currency: o.currency ?? 'EUR',
      paymentMode: o.paymentMode ?? 'full',
      shippingAddress,
    })
    await resend.emails.send({
      from,
      to: adminEmail,
      subject: `Нова платена поръчка #${String(orderId).slice(-8).toUpperCase()} — ${o.email}`,
      html: adminHtml,
    }).catch(() => {})
  }
}

async function sendRegistrationConfirmationEmail(payload: BasePayload, registrationId: string) {
  const reg = await payload.findByID({ collection: 'registrations', id: registrationId, depth: 2 }).catch(() => null)
  if (!reg) return
  const r = reg as any
  if (!r.email) return

  const title = r.trip?.title ?? r.program?.title ?? r.destination?.name ?? 'Пътуване'
  const itemType = r.trip ? 'trip' : r.program ? 'program' : r.destination ? 'destination' : 'trip'
  const startDate = r.trip?.startDate ?? r.program?.startDate ?? r.destination?.startDate ?? null
  const endDate = r.trip?.endDate ?? r.program?.endDate ?? r.destination?.endDate ?? null
  const location = r.trip?.location ?? r.destination?.location ?? null
  const installments = (r.installments ?? []) as any[]
  const nextInstallment = installments.find((row) => row.status === 'pending') ?? null

  const { resend } = await import('@/lib/resend')
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com',
    to: r.email,
    subject: 'Резервацията е потвърдена — Sons of Mountains',
    html: buildOrderConfirmationHtml({
      firstName: r.firstName ?? '',
      orderNumber: String(registrationId).slice(-8).toUpperCase(),
      items: [{ itemType, title, quantity: r.participantCount ?? 1, unitPrice: (r.totalAmount ?? r.amount ?? 0) / (r.participantCount ?? 1), startDate, endDate, location }],
      total: r.totalAmount ?? r.amount ?? 0,
      currency: 'EUR',
      paymentMode: r.paymentMode ?? 'full',
      depositPaid: r.depositPaid,
      remainingBalance: r.remainingBalance,
      remainingDueDate: r.remainingDueDate,
      nextInstallment,
    }),
  }).catch(() => {})
}

async function generateInvoice(
  payload: BasePayload,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  collection: 'orders' | 'registrations',
  docId: string,
) {
  try {
    const stripeCustomerId = session.customer as string | null
    if (!stripeCustomerId) return
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
    const inv = await stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: false,
      metadata: { payloadCollection: collection, payloadId: docId },
    })
    for (const item of lineItems.data) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        invoice: inv.id,
        description: item.description ?? 'Sons of Mountains',
        amount: item.amount_total,
        currency: item.currency,
      })
    }
    if (!inv.id) return
    const finalized = await stripe.invoices.finalizeInvoice(inv.id)
    await payload.update({
      collection,
      id: docId,
      data: {
        invoiceId: finalized.id,
        invoicePdfUrl: finalized.invoice_pdf ?? undefined,
      } as any,
    })
  } catch {}
}

export async function decrementOrderItemsSpotsAndStock(payload: BasePayload, items: any[]) {
  for (const item of items ?? []) {
    if (item.itemType === 'trip' && item.trip) {
      const tId = typeof item.trip === 'string' ? item.trip : item.trip.id
      const trip = await payload.findByID({ collection: 'trips', id: tId }).catch(() => null)
      if (trip) {
        const participantCount = item.quantity ?? item.participantCount ?? 1
        const newSpots = Math.max(0, (trip as any).spotsAvailable - participantCount)
        const earlyBirdDecrement = item.earlyBirdCount ?? Math.min(participantCount, (trip as any).earlyBirdSpotsRemaining ?? 0)
        const newEarlyBirdSpots = Math.max(0, ((trip as any).earlyBirdSpotsRemaining ?? 0) - earlyBirdDecrement)
        await payload.update({ collection: 'trips', id: tId, data: { spotsAvailable: newSpots, earlyBirdSpotsRemaining: newEarlyBirdSpots, status: newSpots === 0 ? 'soldOut' : 'active' } })
        if (newSpots > 0) await notifyWaitlist(payload, 'trip', tId)
      }
    }
    if (item.itemType === 'product' && item.product) {
      const pId = typeof item.product === 'string' ? item.product : item.product.id
      const product = await payload.findByID({ collection: 'products', id: pId }).catch(() => null)
      if (product) {
        if (item.variantId) {
          const variants = ((product as any).variants ?? []).map((v: any) =>
            v.id === item.variantId ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v
          )
          await payload.update({ collection: 'products', id: pId, data: { variants } })
        } else {
          await payload.update({ collection: 'products', id: pId, data: { stock: Math.max(0, (product as any).stock - item.quantity) } })
        }
      }
    }
    if (item.itemType === 'program' && item.program) {
      const pgId = typeof item.program === 'string' ? item.program : item.program.id
      const program = await payload.findByID({ collection: 'programs', id: pgId }).catch(() => null)
      if (program) {
        const participantCount = item.quantity ?? item.participantCount ?? 1
        const newSpots = Math.max(0, (program as any).spotsAvailable - participantCount)
        const earlyBirdDecrement = item.earlyBirdCount ?? Math.min(participantCount, (program as any).earlyBirdSpotsRemaining ?? 0)
        const newEarlyBirdSpots = Math.max(0, ((program as any).earlyBirdSpotsRemaining ?? 0) - earlyBirdDecrement)
        await payload.update({ collection: 'programs', id: pgId, data: { spotsAvailable: newSpots, earlyBirdSpotsRemaining: newEarlyBirdSpots, status: newSpots === 0 ? 'Sold Out' : 'Active' } })
      }
    }
    if (item.itemType === 'destination' && item.destination) {
      const dId = typeof item.destination === 'string' ? item.destination : item.destination.id
      const destination = await payload.findByID({ collection: 'destinations', id: dId }).catch(() => null)
      if (destination) {
        const participantCount = item.quantity ?? item.participantCount ?? 1
        const newSpots = Math.max(0, (destination as any).spotsAvailable - participantCount)
        const earlyBirdDecrement = item.earlyBirdCount ?? Math.min(participantCount, (destination as any).earlyBirdSpotsRemaining ?? 0)
        const newEarlyBirdSpots = Math.max(0, ((destination as any).earlyBirdSpotsRemaining ?? 0) - earlyBirdDecrement)
        await payload.update({ collection: 'destinations', id: dId, data: { spotsAvailable: newSpots, earlyBirdSpotsRemaining: newEarlyBirdSpots, bookingStatus: newSpots === 0 ? 'soldOut' : 'active' } })
        if (newSpots > 0) await notifyWaitlist(payload, 'destination', dId)
      }
    }
    if (item.itemType === 'bundle' && item.bundle) {
      const bId = typeof item.bundle === 'string' ? item.bundle : item.bundle.id
      const bundle = await payload.findByID({ collection: 'bundles', id: bId }).catch(() => null)
      if (bundle) {
        await payload.update({ collection: 'bundles', id: bId, data: { usedCount: ((bundle as any).usedCount ?? 0) + 1 } })
      }
    }
  }
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session, payload: BasePayload) {
  const stripe = await getStripe()
  const meta = session.metadata ?? {}
  const { orderId, type, tripId, recordId, paymentMode, discountCodeId, giftVoucherId, loyaltyPointsRedeemed } = meta

  // Detect 3DS
  let scaVerified = false
  try {
    if (session.payment_intent) {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string, {
        expand: ['payment_method_details'],
      })
      scaVerified = !!(pi as any).payment_method_details?.card?.three_d_secure
    }
  } catch {}

  if (type === 'cart' && orderId) {
    const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 2 }).catch(() => null)
    if (!order) return
    if ((order as any).status === 'paid') return

    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: 'paid',
        paidAt: new Date().toISOString(),
        stripePaymentIntentId: (session.payment_intent as string) ?? null,
        scaVerified,
      } as any,
    })

    {
      const orderNumber = String(orderId).slice(-8).toUpperCase()
      const ga4Items = ((order as any).items ?? []).map((item: any) => ({
        item_id: String(item.trip?.id ?? item.product?.id ?? item.program?.id ?? item.destination?.id ?? item.bundle?.id ?? orderId),
        item_name: ga4ItemTitle(item),
        price: item.unitPrice ?? 0,
        quantity: item.quantity ?? item.participantCount ?? 1,
        item_category: item.itemType,
      }))
      const orderValue = (order as any).totalAmount ?? (order as any).amount ?? (order as any).price ?? 0
      await sendGa4Purchase({
        orderId: String(orderId),
        transactionId: orderNumber,
        value: orderValue,
        currency: ((order as any).currency as string) ?? 'EUR',
        items: ga4Items,
      })
    }

    // Save payment method for future use
    if (session.payment_intent && session.customer) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
        if (pmId) {
          await stripe.paymentMethods.attach(pmId, { customer: session.customer as string }).catch(() => {})
          await stripe.customers.update(session.customer as string, {
            invoice_settings: { default_payment_method: pmId },
          }).catch(() => {})
          // Find Payload customer and update default PM
          const custResult = await payload.find({
            collection: 'customers',
            where: { stripeCustomerId: { equals: session.customer } },
            limit: 1,
          }).catch(() => null)
          if (custResult?.docs[0]) {
            await payload.update({ collection: 'customers', id: custResult.docs[0].id, data: { defaultPaymentMethodId: pmId } as any })
          }
        }
      } catch {}
    }

    // Spots/stock decrement runs in Orders collection afterChange hook (decrementSpotsOnPaid)
    // so it fires exactly once regardless of which code path marks the order 'paid'.

    // Mark discount code used
    if (discountCodeId) {
      const dc = await payload.findByID({ collection: 'discount-codes', id: discountCodeId }).catch(() => null)
      if (dc) {
        const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
        await payload.update({
          collection: 'discount-codes',
          id: discountCodeId,
          data: {
            usedCount: ((dc as any).usedCount ?? 0) + 1,
            usedByCustomers: customerId
              ? [...((dc as any).usedByCustomers ?? []), { customer: customerId, usedAt: new Date().toISOString() }]
              : (dc as any).usedByCustomers,
          },
        })
        if ((dc as any).type === 'referral' && (dc as any).referredBy) {
          const referrerId = typeof (dc as any).referredBy === 'string' ? (dc as any).referredBy : (dc as any).referredBy?.id
          const referrer = await payload.findByID({ collection: 'customers', id: referrerId }).catch(() => null)
          if (referrer) {
            await payload.create({
              collection: 'gift-vouchers',
              data: {
                code: `REW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
                customer: referrerId,
                recipientEmail: (referrer as any).email,
                recipientName: (referrer as any).name ?? '',
                amount: 20,
                currency: 'EUR',
                status: 'active',
                message: 'Referral reward — thank you for spreading the adventure!',
              },
            })
          }
        }
      }
    }

    // Mark gift voucher redeemed
    if (giftVoucherId) {
      const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
      await payload.update({
        collection: 'gift-vouchers',
        id: giftVoucherId,
        data: { status: 'redeemed', redeemedAt: new Date().toISOString(), redeemedByCustomerId: customerId ?? '' },
      }).catch(() => {})
    }

    // Deduct loyalty points
    const pointsRedeemed = parseInt(loyaltyPointsRedeemed ?? '0', 10)
    const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
    if (pointsRedeemed > 0 && customerId) {
      const cust = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
      if (cust) {
        const newPoints = Math.max(0, ((cust as any).loyaltyPoints ?? 0) - pointsRedeemed)
        await payload.update({ collection: 'customers', id: customerId, data: { loyaltyPoints: newPoints } })
      }
    }

    // Credit loyalty points earned
    const amountTotal = (session.amount_total ?? 0) / 100
    await creditLoyaltyPoints(payload, customerId, amountTotal)

    // Generate invoice PDF
    await generateInvoice(payload, stripe, session, 'orders', orderId)

    // Send booking confirmation email
    await sendOrderConfirmationEmail(payload, orderId).catch(() => {})

    // Update receipt info
    try {
      if (session.payment_intent) {
        const descriptionParts: string[] = []
        for (const item of ((order as any).items ?? []) as any[]) {
          const title = item.trip?.title ?? item.product?.title ?? item.program?.title ?? item.bundle?.title ?? 'Item'
          descriptionParts.push(title)
        }
        await stripe.paymentIntents.update(session.payment_intent as string, {
          description: `Sons of Mountains — ${descriptionParts.join(', ')}`,
          receipt_email: (order as any).email,
        })
        await payload.update({ collection: 'orders', id: orderId, data: { receiptSentAt: new Date().toISOString() } as any })
      }
    } catch {}

    // Schedule remaining installments if deposit or installments mode
    if ((paymentMode === 'deposit' || paymentMode === 'installments') && session.payment_intent && session.customer) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
        if (pmId) {
          const updateData: Record<string, unknown> = { balancePaymentIntentId: `scheduled:${pmId}`, balanceChargeStatus: 'pending' }
          if (paymentMode === 'installments') {
            const freshOrder = await payload.findByID({ collection: 'orders', id: orderId }).catch(() => null)
            const installments = ((freshOrder as any)?.installments ?? []) as any[]
            if (installments[0]) {
              installments[0] = { ...installments[0], status: 'charged', paymentIntentId: session.payment_intent as string, chargeAttemptedAt: new Date().toISOString() }
              updateData.installments = installments
            }
          }
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: updateData as any,
          })
        }
      } catch {}
    }

    try {
      after(() => {
        try { revalidateTag('products', 'max') } catch {}
        try { revalidateTag('trips', 'max') } catch {}
        try { revalidatePath('/shop') } catch {}
      })
    } catch {
      try { revalidateTag('products', 'max') } catch {}
      try { revalidateTag('trips', 'max') } catch {}
      try { revalidatePath('/shop') } catch {}
    }
    return
  }

  // Legacy single-item
  const id = recordId ?? orderId
  if (!id) return

  if (type === 'registration' || type === 'deposit') {
    const existingReg = await payload.findByID({ collection: 'registrations', id }).catch(() => null)
    if (!existingReg) return
    if ((existingReg as any).status === 'paid') return

    const paymentModeValue = paymentMode ?? 'full'
    const updateData: Record<string, unknown> = {
      status: 'paid',
      paidAt: new Date().toISOString(),
      stripePaymentIntentId: (session.payment_intent as string) ?? null,
      scaVerified,
    }
    if (paymentModeValue === 'deposit') {
      updateData.paymentMode = 'deposit'
      updateData.depositPaid = (session.amount_total ?? 0) / 100
    }
    if (paymentModeValue === 'installments') {
      updateData.paymentMode = 'installments'
    }
    await payload.update({ collection: 'registrations', id, data: updateData as any })
    await generateInvoice(payload, stripe, session, 'registrations', id)
    await sendRegistrationConfirmationEmail(payload, id).catch(() => {})

    {
      const paidReg = await payload.findByID({ collection: 'registrations', id, depth: 2 }).catch(() => null) as any
      if (paidReg) {
        const regNumber = String(id).slice(-8).toUpperCase()
        const regItemType = paidReg.trip ? 'trip' : paidReg.program ? 'program' : paidReg.destination ? 'destination' : 'registration'
        const regEntity = paidReg.trip ?? paidReg.program ?? paidReg.destination ?? null
        await sendGa4Purchase({
          orderId: String(id),
          transactionId: regNumber,
          value: (session.amount_total ?? 0) / 100,
          currency: (session.currency ?? 'eur').toUpperCase(),
          items: [{
            item_id: String(regEntity?.id ?? id),
            item_name: regEntity?.title ?? regEntity?.name ?? 'Registration',
            price: (paidReg.totalAmount as number) ?? (session.amount_total ?? 0) / 100,
            quantity: (paidReg.participantCount as number) ?? 1,
            item_category: regItemType,
          }],
        })
      }
    }

    if (tripId) {
      const reg = await payload.findByID({ collection: 'registrations', id }).catch(() => null)
      const trip = await payload.findByID({ collection: 'trips', id: tripId }).catch(() => null)
      if (trip && reg) {
        const participantCount = (reg as any).participantCount ?? 1
        const newSpots = Math.max(0, (trip as any).spotsAvailable - participantCount)
        const earlyBirdDecrement = Math.min(participantCount, (trip as any).earlyBirdSpotsRemaining ?? 0)
        const newEarlyBirdSpots = Math.max(0, ((trip as any).earlyBirdSpotsRemaining ?? 0) - earlyBirdDecrement)
        await payload.update({ collection: 'trips', id: tripId, data: { spotsAvailable: newSpots, earlyBirdSpotsRemaining: newEarlyBirdSpots, status: newSpots === 0 ? 'soldOut' : 'active' } })
        if (newSpots > 0) await notifyWaitlist(payload, 'trip', tripId)
        try {
          after(() => {
            try { revalidateTag('trips', 'max') } catch {}
            try { revalidatePath('/destinations') } catch {}
          })
        } catch {
          try { revalidateTag('trips', 'max') } catch {}
          try { revalidatePath('/destinations') } catch {}
        }
      }
    }

    // Schedule remaining installments if deposit or installments mode
    if ((paymentModeValue === 'deposit' || paymentModeValue === 'installments') && session.payment_intent && session.customer) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
        if (pmId) {
          const regUpdateData: Record<string, unknown> = { balancePaymentIntentId: `scheduled:${pmId}`, balanceChargeStatus: 'pending' }
          if (paymentModeValue === 'installments') {
            const freshReg = await payload.findByID({ collection: 'registrations', id }).catch(() => null)
            const installments = ((freshReg as any)?.installments ?? []) as any[]
            if (installments[0]) {
              installments[0] = { ...installments[0], status: 'charged', paymentIntentId: session.payment_intent as string, chargeAttemptedAt: new Date().toISOString() }
              regUpdateData.installments = installments
            }
          }
          await payload.update({ collection: 'registrations', id, data: regUpdateData as any })
        }
      } catch {}
    }
  } else if (type === 'order') {
    const existingOrder = await payload.findByID({ collection: 'orders', id, depth: 2 }).catch(() => null)
    if (!existingOrder) return
    if ((existingOrder as any).status === 'paid') return
    // Spots/stock decrement runs in Orders collection afterChange hook (decrementSpotsOnPaid).
    await payload.update({ collection: 'orders', id, data: { status: 'paid', paidAt: new Date().toISOString(), scaVerified } as any })
    if ((existingOrder as any).discountCode) {
      const dcId = typeof (existingOrder as any).discountCode === 'string' ? (existingOrder as any).discountCode : (existingOrder as any).discountCode?.id
      const dc = await payload.findByID({ collection: 'discount-codes', id: dcId }).catch(() => null)
      if (dc) {
        await payload.update({ collection: 'discount-codes', id: dcId, data: { usedCount: ((dc as any).usedCount ?? 0) + 1 } as any })
      }
    }
    await generateInvoice(payload, stripe, session, 'orders', id)
  } else if (type === 'voucher') {
    await payload.update({ collection: 'gift-vouchers', id, data: { paidAt: new Date().toISOString(), status: 'active' } })
  }
}

function escHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function handleSubscriptionUpsert(sub: Stripe.Subscription, payload: BasePayload) {
  try {
    const existing = await payload.find({ collection: 'subscriptions', where: { stripeSubscriptionId: { equals: sub.id } }, limit: 1 })
    const status = sub.status === 'active' || sub.status === 'trialing' ? sub.status : sub.status === 'past_due' ? 'past_due' : 'cancelled'
    const priceId = (sub.items?.data?.[0]?.price?.id) ?? undefined

    if (existing.docs.length > 0) {
      const updateData: Record<string, unknown> = {
        status,
        currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      }
      if (priceId) updateData.stripePriceId = priceId
      if (status === 'past_due' && !(existing.docs[0] as any).pastDueAt) {
        updateData.pastDueAt = new Date().toISOString()
      }
      await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: updateData as any })

      // Send dunning email if past_due
      if (status === 'past_due') {
        const sub_doc = existing.docs[0] as any
        const emailsSent = sub_doc.dunningEmailsSent ?? 0
        const trigger = emailsSent === 0 ? 'subscription_payment_failed' : emailsSent === 1 ? 'subscription_dunning_2' : 'subscription_dunning_3'
        const { sendFlow } = await import('@/lib/email-flows')
        await sendFlow(trigger, { email: sub_doc.customer?.email ?? (sub.customer as string) }, {
          dunningCount: emailsSent + 1,
          billingUpdateUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/billing`,
        }, payload).catch(() => {})
        await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { dunningEmailsSent: emailsSent + 1 } as any })
      }

      // Send recovery email if was past_due → active
      if (status === 'active' && (existing.docs[0] as any).pastDueAt) {
        const sub_doc = existing.docs[0] as any
        const { sendFlow } = await import('@/lib/email-flows')
        await sendFlow('subscription_payment_recovered', { email: sub_doc.customer?.email ?? (sub.customer as string) }, {}, payload).catch(() => {})
        await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { pastDueAt: null, dunningEmailsSent: 0 } as any })
      }
    } else {
      await payload.create({
        collection: 'subscriptions',
        data: {
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          plan: 'monthly',
          status: status as any,
          stripePriceId: priceId,
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
        } as any,
      })
    }
  } catch {}
}

export async function handleSubscriptionDeleted(sub: Stripe.Subscription, payload: BasePayload) {
  try {
    const existing = await payload.find({ collection: 'subscriptions', where: { stripeSubscriptionId: { equals: sub.id } }, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { status: 'cancelled' as any } })
      const discountId = typeof (existing.docs[0] as any).discountCode === 'string'
        ? (existing.docs[0] as any).discountCode
        : (existing.docs[0] as any).discountCode?.id
      if (discountId) {
        await payload.update({ collection: 'discount-codes', id: discountId, data: { isActive: false } }).catch(() => {})
      }
    }
  } catch {}
}

export async function handleChargeRefunded(charge: Stripe.Charge, payload: BasePayload) {
  if (!charge.payment_intent) return
  try {
    const refund = charge.refunds?.data?.[0]
    const refundId = refund?.id ?? null
    const refundAmount = (refund?.amount ?? 0) / 100

    // Find order by payment intent
    const orders = await payload.find({
      collection: 'orders',
      where: { stripePaymentIntentId: { equals: charge.payment_intent as string } },
      limit: 1,
      depth: 2,
    })
    if (orders.docs.length > 0) {
      const order = orders.docs[0] as any
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'refunded', stripeRefundId: refundId, refundAmount } as any,
      })
      const orderNumber = String(order.id).slice(-8).toUpperCase()
      const items = ((order.items ?? []) as any[]).map((item) => ({
        item_id: String(item.trip?.id ?? item.product?.id ?? item.program?.id ?? item.destination?.id ?? item.bundle?.id ?? order.id),
        item_name: ga4ItemTitle(item),
        price: item.unitPrice ?? 0,
        quantity: item.quantity ?? item.participantCount ?? 1,
        item_category: item.itemType,
      }))
      await sendGa4Refund({
        orderId: String(order.id),
        transactionId: orderNumber,
        value: refundAmount,
        currency: (order.currency as string) ?? 'EUR',
        items,
      })
      return
    }

    // Find registration by payment intent
    const regs = await payload.find({
      collection: 'registrations',
      where: { stripePaymentIntentId: { equals: charge.payment_intent as string } },
      limit: 1,
      depth: 2,
    })
    if (regs.docs.length > 0) {
      const reg = regs.docs[0] as any
      await payload.update({
        collection: 'registrations',
        id: reg.id,
        data: { status: 'refunded', stripeRefundId: refundId, refundAmount } as any,
      })
      const regNumber = String(reg.id).slice(-8).toUpperCase()
      const itemType = reg.trip ? 'trip' : reg.program ? 'program' : reg.destination ? 'destination' : 'registration'
      const entity = reg.trip ?? reg.program ?? reg.destination ?? null
      await sendGa4Refund({
        orderId: String(reg.id),
        transactionId: regNumber,
        value: refundAmount,
        currency: (reg.currency as string) ?? 'EUR',
        items: [{
          item_id: String(entity?.id ?? reg.id),
          item_name: entity?.title ?? entity?.name ?? 'Registration',
          price: (reg.totalAmount as number) ?? refundAmount,
          quantity: (reg.participantCount as number) ?? 1,
          item_category: itemType,
        }],
      })
    }
  } catch {}
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, payload: BasePayload) {
  // For subscription invoices, dunning is handled in handleSubscriptionUpsert
  // For order invoices, send a payment retry email
  try {
    const { resend } = await import('@/lib/resend')
    const customerEmail = typeof invoice.customer_email === 'string' ? invoice.customer_email : null
    if (!customerEmail) return
    const retryUrl = invoice.hosted_invoice_url ?? `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com',
      to: customerEmail,
      subject: 'Payment failed — action required',
      html: `<p>Your payment could not be processed. <a href="${retryUrl}">Click here to retry</a>.</p>`,
    }).catch(() => {})
  } catch {}
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, payload: BasePayload) {
  // Update subscription period end
  if (!invoice.subscription) return
  try {
    const existing = await payload.find({
      collection: 'subscriptions',
      where: { stripeSubscriptionId: { equals: invoice.subscription as string } },
      limit: 1,
    })
    if (existing.docs.length > 0 && invoice.lines?.data?.[0]?.period?.end) {
      await payload.update({
        collection: 'subscriptions',
        id: existing.docs[0].id,
        data: { currentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000).toISOString() } as any,
      })
    }
  } catch {}
}

export async function handleInvoiceFinalized(invoice: Stripe.Invoice, payload: BasePayload) {
  if (!invoice.metadata?.payloadCollection || !invoice.metadata?.payloadId) return
  try {
    const collection = invoice.metadata.payloadCollection as 'orders' | 'registrations'
    await payload.update({
      collection,
      id: invoice.metadata.payloadId,
      data: { invoicePdfUrl: invoice.invoice_pdf ?? undefined } as any,
    })
  } catch {}
}

export async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent, payload: BasePayload) {
  // Handle balance charge completion (deposit → remaining)
  if (!pi.metadata?.balanceForCollection || !pi.metadata?.balanceForId) return
  try {
    const collection = pi.metadata.balanceForCollection as 'orders' | 'registrations'
    await payload.update({
      collection,
      id: pi.metadata.balanceForId,
      data: { remainingBalance: 0, status: 'paid', balanceChargeStatus: 'succeeded', balancePaymentIntentId: pi.id } as any,
    })
  } catch {}
}

export async function handlePaymentIntentFailed(pi: Stripe.PaymentIntent, payload: BasePayload) {
  if (!pi.metadata?.balanceForCollection || !pi.metadata?.balanceForId) return
  try {
    const stripe = await getStripe()
    const collection = pi.metadata.balanceForCollection as 'orders' | 'registrations'
    await payload.update({ collection, id: pi.metadata.balanceForId, data: { balanceChargeStatus: 'failed' } as any })

    // Generate retry payment link
    const doc = await payload.findByID({ collection, id: pi.metadata.balanceForId }).catch(() => null)
    if (!doc) return
    const remainingAmount = (doc as any).remainingBalance ?? 0
    const retryLink = await stripe.paymentLinks.create({
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Balance Payment — Sons of Mountains' },
          unit_amount: Math.round(remainingAmount * 100),
        },
        quantity: 1,
      }],
      metadata: { balanceForCollection: collection, balanceForId: pi.metadata.balanceForId },
    } as any).catch(() => null)

    const { sendFlow } = await import('@/lib/email-flows')
    const email = (doc as any).email
    if (email) {
      const trigger = collection === 'orders' ? 'order_balance_failed' : 'registration_balance_failed'
      await sendFlow(trigger, { email, firstName: (doc as any).firstName }, {
        remainingBalance: remainingAmount,
        invoiceUrl: retryLink?.url ?? `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`,
      }, payload).catch(() => {})
    }
  } catch {}
}
