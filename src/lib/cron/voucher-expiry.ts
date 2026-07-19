import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

export async function runVoucherExpiry() {
  const payload = await getPayload({ config })
  const now = Date.now()
  const start = new Date(now + 6 * 86400_000).toISOString()
  const end = new Date(now + 8 * 86400_000).toISOString()

  const vouchers = await payload.find({
    collection: 'gift-vouchers',
    where: {
      and: [
        { status: { equals: 'active' } },
        { expiresAt: { greater_than_equal: start } },
        { expiresAt: { less_than_equal: end } },
      ],
    } as any,
    limit: 500,
  })

  for (const v of vouchers.docs as any[]) {
    if (!v.recipientEmail) continue
    const existingLog = await payload.find({
      collection: 'email-logs',
      where: { and: [{ trigger: { equals: 'gift_voucher_expiry_7d' } }, { recipient: { equals: v.recipientEmail } }] },
      limit: 1,
    })
    if (existingLog.docs.length > 0) continue

    await sendFlow('gift_voucher_expiry_7d', { email: v.recipientEmail, firstName: v.recipientName }, {
      voucherCode: v.code,
      voucherAmount: v.amount,
      voucherExpiry: v.expiresAt,
    }, payload)
  }
}
