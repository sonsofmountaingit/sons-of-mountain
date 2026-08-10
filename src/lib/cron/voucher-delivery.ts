import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVoucherEmailFallback } from '@/payload/hooks/emailFlowTriggers'

/** Sends paid gift vouchers whose purchaser selected a future delivery date. */
export async function runVoucherDelivery() {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()
  const vouchers = await payload.find({
    collection: 'gift-vouchers',
    where: {
      and: [
        { paidAt: { exists: true } },
        { recipientEmail: { exists: true } },
        { deliveryDate: { less_than_equal: now } },
        { deliverySentAt: { exists: false } },
      ],
    },
    limit: 100,
    overrideAccess: true,
  })

  for (const voucher of vouchers.docs as any[]) {
    const recipientName = voucher.recipientName ?? 'Adventurer'
    const senderName = voucher.senderName ?? 'Someone special'
    try {
      await sendVoucherEmailFallback(payload, 'recipient', voucher, recipientName, senderName)
      await payload.update({
        collection: 'gift-vouchers',
        id: voucher.id,
        data: { deliverySentAt: new Date().toISOString() },
        overrideAccess: true,
      })
    } catch (error) {
      console.error(`Voucher delivery failed for ${voucher.id}:`, error)
    }
  }
}
