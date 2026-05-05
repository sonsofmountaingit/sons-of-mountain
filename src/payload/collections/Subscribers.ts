import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'status', 'source', 'subscribedAt'],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'source',
      type: 'select',
      options: ['footer_form', 'booking', 'gift_voucher', 'manual'],
      defaultValue: 'footer_form',
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'destinationInterests',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
    },
  ],
}
