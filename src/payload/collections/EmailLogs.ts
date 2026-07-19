import type { CollectionConfig } from 'payload'

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  admin: {
    group: 'Email Marketing',
    defaultColumns: ['trigger', 'recipient', 'status', 'sentAt'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'flow', type: 'relationship', relationTo: 'email-flows', admin: { readOnly: true, description: 'Which EmailFlow triggered this send. Null for campaign sends.' } },
    { name: 'campaign', type: 'relationship', relationTo: 'campaigns', admin: { readOnly: true, description: 'Which Campaign triggered this send. Null for flow sends.' } },
    { name: 'trigger', type: 'text', admin: { readOnly: true } },
    { name: 'recipient', type: 'email', admin: { readOnly: true } },
    { name: 'subject', type: 'text', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Queued (delayed)', value: 'queued' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Opened', value: 'opened' },
        { label: 'Clicked', value: 'clicked' },
      ],
      defaultValue: 'sent',
      admin: { readOnly: true },
    },
    { name: 'scheduledFor', type: 'date', admin: { readOnly: true, description: 'Populated when status=queued.' } },
    { name: 'resendMessageId', type: 'text', admin: { readOnly: true } },
    { name: 'sentAt', type: 'date', admin: { readOnly: true } },
    { name: 'openedAt', type: 'date', admin: { readOnly: true } },
    { name: 'bouncedAt', type: 'date', admin: { readOnly: true } },
    { name: 'clickedAt', type: 'date', admin: { readOnly: true } },
    { name: 'error', type: 'textarea', admin: { readOnly: true, description: 'Error message if status=failed.' } },
    { name: 'context', type: 'json', admin: { readOnly: true, description: 'Snapshot of all merge tag values at send time.' } },
  ],
}
