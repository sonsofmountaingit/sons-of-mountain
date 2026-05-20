import { getPayload } from 'payload'
import config from '@payload-config'

// Run daily — charges remaining balances due today or earlier
export async function runBalanceCharges() {
  const payload = await getPayload({ config })
  const { stripe } = await import('@/lib/stripe')
  if (!stripe) return
  const now = new Date()

  for (const collection of ['orders', 'registrations'] as const) {
    const docs = await payload.find({
      collection,
      where: {
        and: [
          { paymentMode: { equals: 'deposit' } },
          { balanceChargeStatus: { equals: 'pending' } },
          { remainingBalance: { greater_than: 0 } },
          { remainingDueDate: { less_than_equal: now.toISOString() } },
        ],
      },
      limit: 50,
    })

    for (const doc of docs.docs as any[]) {
      const scheduledPmId: string | undefined = doc.balancePaymentIntentId?.startsWith('scheduled:')
        ? doc.balancePaymentIntentId.replace('scheduled:', '')
        : undefined

      if (!scheduledPmId || !doc.stripeSessionId) continue

      try {
        // Retrieve customer from Stripe session
        const session = await stripe.checkout.sessions.retrieve(doc.stripeSessionId)
        const stripeCustomer = session.customer as string | null
        if (!stripeCustomer) continue

        const pi = await stripe.paymentIntents.create({
          amount: Math.round(doc.remainingBalance * 100),
          currency: 'eur',
          customer: stripeCustomer,
          payment_method: scheduledPmId,
          confirm: true,
          off_session: true,
          metadata: {
            balanceForCollection: collection,
            balanceForId: doc.id,
          },
        })

        await payload.update({
          collection,
          id: doc.id,
          data: { balancePaymentIntentId: pi.id, balanceChargeStatus: 'pending' } as any,
        })
      } catch {
        await payload.update({
          collection,
          id: doc.id,
          data: { balanceChargeStatus: 'failed' } as any,
        })
      }
    }
  }
}
