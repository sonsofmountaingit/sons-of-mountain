import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    group: 'Email Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'scheduledAt', 'sentAt', 'openRate'],
  },
  fields: [
    {
      name: 'sendTestAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '@/payload/components/CampaignSendTestButton#CampaignSendTestButton' },
      },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'template', type: 'relationship', relationTo: 'email-templates', required: true },
    {
      name: 'audienceType',
      type: 'select',
      required: true,
      defaultValue: 'subscribers',
      options: [
        { label: 'Subscribers — opt-in marketing list', value: 'subscribers' },
        { label: 'Customers — all verified active accounts', value: 'customers' },
      ],
      admin: { description: 'Subscribers = newsletter/marketing opt-in list. Customers = logged-in verified/active users.' },
    },
    {
      name: 'segments',
      type: 'relationship',
      relationTo: 'segments',
      hasMany: true,
      admin: { description: 'Recipients are the UNION of all selected segments, deduplicated by email. Leave empty to send to all in the audience type.' },
    },
    { name: 'segment', type: 'relationship', relationTo: 'segments', admin: { description: 'Legacy single-segment field, kept for backwards compatibility.' } },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    { name: 'scheduledAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'sentAt', type: 'date', admin: { readOnly: true } },
    { name: 'fromName', type: 'text', admin: { description: 'Override sender name for this campaign.' } },
    { name: 'fromEmail', type: 'email', admin: { description: 'Override sender address for this campaign.' } },
    { name: 'replyTo', type: 'email', admin: { description: 'Reply-to address for this campaign.' } },
    { name: 'testEmail', type: 'email', admin: { description: '"Send Test" sends one email here with real merge tags. Does not affect scheduling.' } },
    { name: 'featuredTrips', type: 'relationship', relationTo: 'trips', hasMany: true, admin: { description: 'Select trips to feature. Available as {{featuredTrips}} array for the Repeat block.' } },
    { name: 'featuredPrograms', type: 'relationship', relationTo: 'programs', hasMany: true },
    { name: 'featuredDestinations', type: 'relationship', relationTo: 'destinations', hasMany: true },
    {
      name: 'resendMessageIds',
      type: 'array',
      fields: [{ name: 'id', type: 'text' }],
      admin: { readOnly: true, description: 'Resend message IDs from the batch send.' },
    },
    { name: 'sentCount', type: 'number', defaultValue: 0, admin: { readOnly: true, position: 'sidebar' } },
    {
      name: 'stats',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'sent', type: 'number', defaultValue: 0 },
        { name: 'opens', type: 'number', defaultValue: 0 },
        { name: 'clicks', type: 'number', defaultValue: 0 },
        { name: 'bounces', type: 'number', defaultValue: 0 },
        { name: 'unsubscribes', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'openRate',
      type: 'text',
      virtual: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Opens ÷ sent, as a percentage. Updated whenever a Resend open-tracking webhook fires.',
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            const sent = (data as any)?.stats?.sent ?? 0
            const opens = (data as any)?.stats?.opens ?? 0
            if (!sent) return '—'
            return `${((opens / sent) * 100).toFixed(1)}%`
          },
        ],
      },
    },
  ],
}
