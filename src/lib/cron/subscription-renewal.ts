import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

export async function runSubscriptionRenewal() {
  const payload = await getPayload({ config })
  const now = Date.now()
  const start = new Date(now + 2 * 86400_000).toISOString()
  const end = new Date(now + 4 * 86400_000).toISOString()

  const subs = await payload.find({
    collection: 'subscriptions',
    where: {
      and: [
        { status: { equals: 'active' } },
        { cancelAtPeriodEnd: { equals: false } },
        { currentPeriodEnd: { greater_than_equal: start } },
        { currentPeriodEnd: { less_than_equal: end } },
      ],
    } as any,
    depth: 1,
    limit: 500,
  })

  for (const sub of subs.docs as any[]) {
    const email = sub.customer?.email
    if (!email) continue

    const existingLog = await payload.find({
      collection: 'email-logs',
      where: { and: [{ trigger: { equals: 'subscription_renewal_3d' } }, { recipient: { equals: email } }] },
      limit: 1,
    })
    if (existingLog.docs.length > 0) continue

    await sendFlow('subscription_renewal_3d', { email, firstName: sub.customer?.name }, {
      subscriptionPlan: sub.plan === 'monthly' ? 'Monthly Adventure Pass' : 'Annual Adventure Pass',
      subscriptionPeriodEnd: sub.currentPeriodEnd,
      billingUpdateUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/billing`,
    }, payload)
  }
}
