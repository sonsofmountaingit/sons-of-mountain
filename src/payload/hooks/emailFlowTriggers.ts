import type { BasePayload, CollectionAfterChangeHook } from 'payload'
import { sendFlow } from '@/lib/email-flows'
import { upsertSubscriber } from '@/lib/subscriber-upsert'
import { getResend } from '@/lib/resend'
import { createEmailLog } from '@/lib/email-logger'

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendVoucherEmailFallback(
  payload: BasePayload,
  kind: 'recipient' | 'buyer',
  doc: any,
  recipientName: string,
  senderName: string,
): Promise<void> {
  const to = kind === 'recipient' ? doc.recipientEmail : (doc.isGift ? doc.senderEmail : doc.recipientEmail)
  if (!to) return

  const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com').replace(/\/$/, '')
  const code = escapeHtml(doc.code)
  const amount = escapeHtml(Number(doc.amount).toFixed(2))
  const recipient = escapeHtml(recipientName)
  const sender = escapeHtml(senderName)
  const voucherUrl = `${siteUrl}/vouchers/${encodeURIComponent(doc.code)}`
  const subject = kind === 'recipient'
    ? `Получихте подаръчен ваучер от ${senderName}`
    : `Потвърждение за подаръчен ваучер ${doc.code}`
  const html = kind === 'recipient'
    ? `<p>Здравейте, ${recipient}!</p><p>${sender} ви изпрати подаръчен ваучер от Sons of Mountains на стойност <strong>€${amount}</strong>.</p><p>Вашият код: <strong>${code}</strong></p><p>Използвайте го при плащане в магазина или го вижте тук: <a href="${voucherUrl}">${voucherUrl}</a>.</p>`
    : `<p>Здравейте, ${sender}!</p><p>Плащането за подаръчния ваучер за ${recipient} е потвърдено.</p><p>Код на ваучера: <strong>${code}</strong> · Стойност: <strong>€${amount}</strong></p>`

  const fromEmail = process.env.RESEND_FROM_EMAIL
  try {
    const result = await getResend().emails.send({
      from: fromEmail ? `Sons of Mountains <${fromEmail}>` : 'Sons of Mountains <noreply@sonsofmountains.com>',
      to,
      subject,
      html,
    })
    await createEmailLog(payload, {
      trigger: kind === 'recipient' ? 'gift_voucher_recipient' : 'gift_voucher_buyer',
      recipient: to,
      subject,
      status: 'sent',
      sentAt: new Date().toISOString(),
      resendMessageId: result.data?.id,
      html,
      context: { voucherId: String(doc.id), voucherCode: doc.code, deliveryType: kind },
    })
  } catch (error) {
    await createEmailLog(payload, {
      trigger: kind === 'recipient' ? 'gift_voucher_recipient' : 'gift_voucher_buyer',
      recipient: to,
      subject,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      html,
      context: { voucherId: String(doc.id), voucherCode: doc.code, deliveryType: kind },
    }).catch(() => {})
    throw error
  }
}

function statusChanged(doc: any, previousDoc: any, isNew: boolean, value: string): boolean {
  return doc.status === value && (isNew ? true : previousDoc?.status !== value)
}

export const registrationEmailFlows: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const isNew = operation === 'create'
  const trip = typeof doc.trip === 'object' ? doc.trip : null
  const program = typeof doc.program === 'object' ? doc.program : null
  const destination = typeof doc.destination === 'object' ? doc.destination : null
  const title = trip?.title ?? program?.title ?? destination?.name ?? ''
  const recipient = { email: doc.email, firstName: doc.firstName, lastName: doc.lastName }
  const base = { tripTitle: title, tripStartDate: trip?.startDate ?? '', tripEndDate: trip?.endDate ?? '', tripLocation: trip?.location ?? '', siteUrl: process.env.NEXT_PUBLIC_SERVER_URL }

  if (!doc.email) return doc
  if (doc.status === previousDoc?.status && !isNew) {
    if (doc.checkedIn && !previousDoc?.checkedIn) {
      await sendFlow('registration_checkin', recipient, { ...base }, req.payload).catch(() => {})
    }
    if (doc.certificateIssuedAt && !previousDoc?.certificateIssuedAt) {
      await sendFlow('registration_certificate', recipient, { ...base }, req.payload).catch(() => {})
    }
    return doc
  }

  if (isNew && doc.status === 'pending') {
    await sendFlow('registration_pending', recipient, { ...base, participantCount: doc.participantCount }, req.payload).catch(() => {})
  }

  if (statusChanged(doc, previousDoc, isNew, 'paid')) {
    await upsertSubscriber(req.payload, { email: doc.email, firstName: doc.firstName, lastName: doc.lastName, source: 'booking' })
    // The canonical receipt is sent by sendPurchaseConfirmation. Do not also
    // fire optional paid Email Flows, which would give customers duplicate
    // purchase confirmations.
  }

  if (statusChanged(doc, previousDoc, isNew, 'confirmed')) {
    await sendFlow('registration_confirmed', recipient, { ...base, qrToken: doc.qrToken }, req.payload).catch(() => {})
  }

  if (statusChanged(doc, previousDoc, isNew, 'cancelled')) {
    await sendFlow('registration_cancelled', recipient, { ...base }, req.payload).catch(() => {})
  }

  if (statusChanged(doc, previousDoc, isNew, 'refunded')) {
    await sendFlow('registration_refunded', recipient, { ...base, refundAmount: doc.refundAmount, currency: doc.currency, stripeRefundId: doc.stripeRefundId }, req.payload).catch(() => {})
  }

  return doc
}

export const orderEmailFlows: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const isNew = operation === 'create'
  if (!doc.email || doc.status === previousDoc?.status) return doc

  const recipient = { email: doc.email, firstName: doc.firstName }
  const orderItems = ((doc.items ?? []) as any[])
    .map((i) => i.trip?.title ?? i.product?.title ?? i.program?.title ?? i.destination?.name ?? i.bundle?.title ?? '')
    .filter(Boolean)
    .join(', ')

  if (statusChanged(doc, previousDoc, isNew, 'paid')) {
    await upsertSubscriber(req.payload, { email: doc.email, firstName: doc.firstName, source: 'booking' })
    // The canonical receipt is sent by sendPurchaseConfirmation. Do not also
    // fire optional paid Email Flows, which would give customers duplicate
    // purchase confirmations.
  }

  if (statusChanged(doc, previousDoc, isNew, 'cancelled')) {
    await sendFlow('order_cancelled', recipient, { orderItems }, req.payload).catch(() => {})
  }

  if (statusChanged(doc, previousDoc, isNew, 'refunded')) {
    await sendFlow('order_refunded', recipient, { refundAmount: doc.refundAmount, currency: doc.currency, stripeRefundId: doc.stripeRefundId }, req.payload).catch(() => {})
  }

  if (doc.trackingNumber && !previousDoc?.trackingNumber) {
    await sendFlow('order_shipped', recipient, { trackingNumber: doc.trackingNumber, shippingProvider: doc.shippingProvider, orderItems }, req.payload).catch(() => {})
  }

  return doc
}

export const giftVoucherEmailFlows: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation === 'create') return doc
  if (!doc.paidAt || previousDoc?.paidAt) return doc

  const isGift = !!doc.isGift
  const senderName = doc.senderName ?? 'Someone special'
  const recipientName = doc.recipientName ?? 'Adventurer'

  if (doc.recipientEmail) {
    const deliveryDate = doc.deliveryDate ? new Date(doc.deliveryDate) : null
    const isScheduledForLater = deliveryDate && deliveryDate.getTime() > Date.now()
    if (isScheduledForLater) {
      await createEmailLog(req.payload, {
        trigger: 'gift_voucher_recipient',
        recipient: doc.recipientEmail,
        subject: `Подаръчен ваучер ${doc.code}`,
        status: 'queued',
        scheduledFor: deliveryDate.toISOString(),
        context: { voucherId: String(doc.id), voucherCode: doc.code, deliveryType: 'recipient' },
      })
    } else {
      const result = await sendFlow('gift_voucher_recipient', { email: doc.recipientEmail, firstName: recipientName }, {
        recipientName, senderName, voucherCode: doc.code, voucherAmount: doc.amount, currency: doc.currency,
        voucherExpiry: doc.expiresAt, voucherMessage: doc.message,
      }, req.payload).catch(() => ({ sent: false, reason: 'failed' as const }))
      // The production DB currently has no configured email flows. A paid voucher
      // must still deliver its code, so use the transactional fallback unless a
      // configured flow actually sent or queued the message.
      if (!result.sent && result.reason !== 'queued') await sendVoucherEmailFallback(req.payload, 'recipient', doc, recipientName, senderName).catch(() => {})
      await req.payload.update({ collection: 'gift-vouchers', id: doc.id, data: { deliverySentAt: new Date().toISOString() } })
    }
    await upsertSubscriber(req.payload, { email: doc.recipientEmail, firstName: recipientName, source: 'gift_voucher' })
  }

  const buyerEmail = isGift ? doc.senderEmail : doc.recipientEmail
  if (buyerEmail) {
    const result = await sendFlow('gift_voucher_buyer', { email: buyerEmail, firstName: isGift ? senderName : recipientName }, {
      recipientName, recipientEmail: doc.recipientEmail, voucherCode: doc.code, voucherAmount: doc.amount,
      currency: doc.currency, voucherExpiry: doc.expiresAt, isGift: String(isGift),
    }, req.payload).catch(() => ({ sent: false, reason: 'failed' as const }))
    if (!result.sent && result.reason !== 'queued') await sendVoucherEmailFallback(req.payload, 'buyer', doc, recipientName, senderName).catch(() => {})
  }

  return doc
}
