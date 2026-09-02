import { getPayload } from 'payload'
import config from '@payload-config'

// Run daily — charges remaining balances due today or earlier
export async function runBalanceCharges() {
  const payload = await getPayload({ config })
  const { stripe } = await import('@/lib/stripe')
  if (!stripe) return
  const now = new Date()

  for (const collection of ['orders', 'registrations'] as const) {
    // Legacy 2-tier deposit flow — single balance charge
    const depositDocs = await payload.find({
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

    for (const doc of depositDocs.docs as any[]) {
      const scheduledPmId: string | undefined = doc.balancePaymentIntentId?.startsWith('scheduled:')
        ? doc.balancePaymentIntentId.replace('scheduled:', '')
        : undefined

      if (!scheduledPmId || !doc.stripeSessionId) continue

      try {
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
        }, { idempotencyKey: `balance:${collection}:${doc.id}` })

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

    // Installment plans — iterate each pending, due row independently
    const installmentDocs = await payload.find({
      collection,
      where: {
        and: [
          { paymentMode: { equals: 'installments' } },
        ],
      },
      limit: 50,
    })

    for (const doc of installmentDocs.docs as any[]) {
      const scheduledPmId: string | undefined = doc.balancePaymentIntentId?.startsWith('scheduled:')
        ? doc.balancePaymentIntentId.replace('scheduled:', '')
        : undefined
      const installments = (doc.installments ?? []) as any[]
      if (!scheduledPmId || !doc.stripeSessionId || installments.length === 0) continue

      let stripeCustomer: string | null = null
      try {
        const session = await stripe.checkout.sessions.retrieve(doc.stripeSessionId)
        stripeCustomer = session.customer as string | null
      } catch {
        continue
      }
      if (!stripeCustomer) continue

      let mutated = false
      for (let i = 0; i < installments.length; i++) {
        const row = installments[i]
        if (!['pending', 'failed'].includes(row.status)) continue
        if (!row.dueDate || new Date(row.dueDate) > now) continue
        if ((row.attempts ?? 0) >= 3) continue
        if (row.status === 'failed' && row.firstFailedAt && Date.now() - new Date(row.firstFailedAt).getTime() < 24 * 60 * 60 * 1000) continue

        const attempt = (row.attempts ?? 0) + 1
        if (row.paymentIntentId) {
          const existingPaymentIntent = await stripe.paymentIntents.retrieve(row.paymentIntentId).catch(() => null)
          if (existingPaymentIntent?.status === 'succeeded') {
            installments[i] = { ...row, status: 'charged', paymentIntentId: existingPaymentIntent.id, chargeAttemptedAt: row.chargeAttemptedAt ?? now.toISOString() }
            mutated = true
            continue
          }
          if (existingPaymentIntent && ['processing', 'requires_action', 'requires_confirmation'].includes(existingPaymentIntent.status)) continue
        }
        try {
          const pi = await stripe.paymentIntents.create({
            amount: Math.round(row.amount * 100),
            currency: 'eur',
            customer: stripeCustomer,
            payment_method: scheduledPmId,
            confirm: true,
            off_session: true,
            metadata: {
              balanceForCollection: collection,
              balanceForId: doc.id,
              installmentIndex: String(i),
            },
          }, { idempotencyKey: `balance:${collection}:${doc.id}:installment:${i}:attempt:${attempt}` })
          installments[i] = {
            ...row,
            status: pi.status === 'succeeded' ? 'charged' : 'pending',
            attempts: attempt,
            paymentIntentId: pi.id,
            chargeAttemptedAt: now.toISOString(),
          }
        } catch {
          installments[i] = { ...row, status: 'failed', attempts: attempt, chargeAttemptedAt: now.toISOString(), firstFailedAt: row.firstFailedAt ?? now.toISOString() }
        }
        mutated = true
      }

      if (mutated) {
        await payload.update({ collection, id: doc.id, data: { installments } as any })
      }
    }
  }
}
