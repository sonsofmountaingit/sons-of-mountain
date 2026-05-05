import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'scheduledAt', 'sentAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      required: true,
    },
    {
      name: 'segment',
      type: 'relationship',
      relationTo: 'segments',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'scheduledAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'stats',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'sent', type: 'number', defaultValue: 0 },
        { name: 'opens', type: 'number', defaultValue: 0 },
        { name: 'bounces', type: 'number', defaultValue: 0 },
        { name: 'unsubscribes', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
