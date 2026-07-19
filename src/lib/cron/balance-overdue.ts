import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

export async function runBalanceOverdue() {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const regs = await payload.find({
    collection: 'registrations',
    where: {
      and: [
        { status: { equals: 'paid' } },
        { paymentMode: { equals: 'deposit' } },
        { remainingBalance: { greater_than: 0 } },
        { remainingDueDate: { less_than: now } },
        { reminderSent1d: { equals: true } },
      ],
    } as any,
    limit: 500,
  })

  for (const reg of regs.docs as any[]) {
    if (!reg.email) continue
    await sendFlow('registration_balance_overdue', { email: reg.email, firstName: reg.firstName }, {
      remainingBalance: reg.remainingBalance,
      remainingDueDate: reg.remainingDueDate,
    }, payload)
  }
}
