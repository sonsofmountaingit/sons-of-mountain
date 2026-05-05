import type { CollectionConfig } from 'payload'

export const Segments: CollectionConfig = {
  slug: 'segments',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'filterRules',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: ['tag', 'destination_interest', 'booking_history', 'all'],
          required: true,
        },
        { name: 'value', type: 'text' },
      ],
    },
    {
      name: 'subscriberCount',
      type: 'number',
      admin: { readOnly: true },
    },
  ],
}
