import type { CollectionConfig } from 'payload'

const JOBS = [
  { label: 'Trip Reminders (7d / 1d)', value: 'trip-reminders' },
  { label: 'Balance Overdue', value: 'balance-overdue' },
  { label: 'Balance Reminders (7d / 1d, existing)', value: 'balance-reminders' },
  { label: 'Review Requests', value: 'review-requests' },
  { label: 'Subscription Renewal Reminder (3d)', value: 'subscription-renewal' },
  { label: 'Gift Voucher Expiry Reminder (7d)', value: 'voucher-expiry' },
  { label: 'Waitlist Offer Expiry', value: 'waitlist-expire' },
  { label: 'Delayed / Queued Emails', value: 'delayed-emails' },
  { label: 'Abandoned Cart Nudges (1h / 24h, existing)', value: 'abandoned-cart' },
  { label: 'Scheduled Campaign Sends', value: 'send-campaigns' },
  { label: 'Send Registration Forms (free transfer peak windows)', value: 'send-registration-forms' },
  { label: 'Sync trips/programs availability (archive ended; mark sold out at 0 spots)', value: 'sync-sold-out' },
]

export const CronJobs: CollectionConfig = {
  slug: 'cron-jobs',
  admin: {
    group: 'Email Marketing',
    useAsTitle: 'label',
    defaultColumns: ['label', 'job', 'enabled', 'intervalMinutes', 'lastRunAt', 'lastStatus'],
  },
  access: {
    create: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'job', type: 'select', required: true, unique: true, options: JOBS },
    { name: 'label', type: 'text', required: true, admin: { description: 'Shown in admin — human name for this scheduled job.' } },
    { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { description: 'Disable to stop this job from running, without deleting its config.' } },
    { name: 'intervalMinutes', type: 'number', required: true, defaultValue: 1440, admin: { description: 'How often this job runs, in minutes. 1440 = once per day, 60 = hourly.' } },
    { name: 'lastRunAt', type: 'date', admin: { readOnly: true, position: 'sidebar', description: 'Last time this job actually executed.' } },
    {
      name: 'lastStatus',
      type: 'select',
      admin: { readOnly: true, position: 'sidebar' },
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Never run', value: 'never' },
      ],
      defaultValue: 'never',
    },
    { name: 'lastError', type: 'textarea', admin: { readOnly: true, description: 'Error message from the last failed run.' } },
  ],
}
