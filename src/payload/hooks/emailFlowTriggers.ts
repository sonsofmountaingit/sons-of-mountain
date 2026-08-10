import type { CollectionAfterChangeHook } from 'payload'
import { sendFlow } from '@/lib/email-flows'
import { upsertSubscriber } from '@/lib/subscriber-upsert'

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
    await sendFlow('gift_voucher_recipient', { email: doc.recipientEmail, firstName: recipientName }, {
      recipientName, senderName, voucherCode: doc.code, voucherAmount: doc.amount, currency: doc.currency,
      voucherExpiry: doc.expiresAt, voucherMessage: doc.message,
    }, req.payload).catch(() => {})
    await upsertSubscriber(req.payload, { email: doc.recipientEmail, firstName: recipientName, source: 'gift_voucher' })
  }

  const buyerEmail = isGift ? doc.senderEmail : doc.recipientEmail
  if (buyerEmail) {
    await sendFlow('gift_voucher_buyer', { email: buyerEmail, firstName: isGift ? senderName : recipientName }, {
      recipientName, recipientEmail: doc.recipientEmail, voucherCode: doc.code, voucherAmount: doc.amount,
      currency: doc.currency, voucherExpiry: doc.expiresAt, isGift: String(isGift),
    }, req.payload).catch(() => {})
  }

  return doc
}
