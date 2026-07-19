import type { BasePayload } from 'payload'

export type CronJobKey =
  | 'trip-reminders'
  | 'balance-overdue'
  | 'balance-reminders'
  | 'review-requests'
  | 'subscription-renewal'
  | 'voucher-expiry'
  | 'waitlist-expire'
  | 'delayed-emails'
  | 'abandoned-cart'
  | 'send-campaigns'
  | 'send-registration-forms'
  | 'sync-sold-out'

const runners: Record<CronJobKey, () => Promise<unknown>> = {
  'trip-reminders': async () => (await import('@/lib/cron/trip-reminders')).runTripReminders(),
  'balance-overdue': async () => (await import('@/lib/cron/balance-overdue')).runBalanceOverdue(),
  'balance-reminders': async () => (await import('@/lib/cron/balance-reminders')).runBalanceReminders(),
  'review-requests': async () => (await import('@/lib/cron/review-requests')).runReviewRequests(),
  'subscription-renewal': async () => (await import('@/lib/cron/subscription-renewal')).runSubscriptionRenewal(),
  'voucher-expiry': async () => (await import('@/lib/cron/voucher-expiry')).runVoucherExpiry(),
  'waitlist-expire': async () => (await import('@/lib/cron/waitlist-expire')).runWaitlistExpire(),
  'delayed-emails': async () => (await import('@/lib/cron/delayed-emails')).runDelayedEmails(),
  'abandoned-cart': async () => (await import('@/lib/cron/abandoned-cart')).processAbandonedCarts(),
  'send-campaigns': async () => (await import('@/lib/cron/send-campaigns')).runSendCampaigns(),
  'send-registration-forms': async () => (await import('@/lib/cron/send-registration-forms')).runSendRegistrationForms(),
  'sync-sold-out': async () => (await import('@/lib/cron/sync-sold-out')).runSyncSoldOut(),
}

export async function runDueCronJobs(payload: BasePayload): Promise<{ ran: string[]; skipped: string[]; failed: { job: string; error: string }[] }> {
  const jobs = await payload.find({ collection: 'cron-jobs', where: { enabled: { equals: true } }, limit: 100 })

  const ran: string[] = []
  const skipped: string[] = []
  const failed: { job: string; error: string }[] = []

  for (const doc of jobs.docs as any[]) {
    const key = doc.job as CronJobKey
    const runner = runners[key]
    if (!runner) continue

    const now = Date.now()
    const dueAt = doc.lastRunAt ? new Date(doc.lastRunAt).getTime() + doc.intervalMinutes * 60_000 : 0
    if (now < dueAt) {
      skipped.push(key)
      continue
    }

    try {
      await runner()
      await payload.update({
        collection: 'cron-jobs',
        id: doc.id,
        data: { lastRunAt: new Date().toISOString(), lastStatus: 'success', lastError: null },
      })
      ran.push(key)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await payload.update({
        collection: 'cron-jobs',
        id: doc.id,
        data: { lastRunAt: new Date().toISOString(), lastStatus: 'failed', lastError: message },
      }).catch(() => {})
      failed.push({ job: key, error: message })
    }
  }

  return { ran, skipped, failed }
}
