import { getPayload } from 'payload'
import config from '@payload-config'

const JOBS: { job: string; label: string; intervalMinutes: number }[] = [
  { job: 'trip-reminders', label: 'Trip Reminders (7d / 1d)', intervalMinutes: 720 },
  { job: 'balance-overdue', label: 'Balance Overdue', intervalMinutes: 1440 },
  { job: 'balance-reminders', label: 'Balance Reminders (7d / 1d, existing)', intervalMinutes: 1440 },
  { job: 'review-requests', label: 'Review Requests', intervalMinutes: 1440 },
  { job: 'subscription-renewal', label: 'Subscription Renewal Reminder (3d)', intervalMinutes: 1440 },
  { job: 'voucher-expiry', label: 'Gift Voucher Expiry Reminder (7d)', intervalMinutes: 1440 },
  { job: 'waitlist-expire', label: 'Waitlist Offer Expiry', intervalMinutes: 60 },
  { job: 'delayed-emails', label: 'Delayed / Queued Emails', intervalMinutes: 15 },
  { job: 'abandoned-cart', label: 'Abandoned Cart Nudges (1h / 24h, existing)', intervalMinutes: 30 },
  { job: 'send-campaigns', label: 'Scheduled Campaign Sends', intervalMinutes: 15 },
  { job: 'send-registration-forms', label: 'Send Registration Forms (free transfer peak windows)', intervalMinutes: 1440 },
  { job: 'sync-sold-out', label: 'Sync Sold Out (trips/programs at 0 spots)', intervalMinutes: 60 },
]

async function main() {
  const payload = await getPayload({ config })
  let created = 0

  for (const job of JOBS) {
    const existing = await payload.find({ collection: 'cron-jobs', where: { job: { equals: job.job } }, limit: 1 })
    if (existing.docs.length > 0) continue
    await payload.create({ collection: 'cron-jobs', data: { ...job, enabled: true } as any })
    created++
  }

  console.log(`Seeded ${created} cron jobs (${JOBS.length - created} already existed).`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
