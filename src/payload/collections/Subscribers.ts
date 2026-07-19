import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    group: 'Email Marketing',
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'status', 'source', 'subscribedAt'],
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.unsubscribeToken) {
          data.unsubscribeToken = crypto.randomUUID()
        }
        return data
      },
    ],
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
    { name: 'unsubscribeToken', type: 'text', unique: true, admin: { readOnly: true, position: 'sidebar', description: 'Auto-generated UUID. Used in unsubscribe link.' } },
    { name: 'lastEmailSentAt', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'emailCount', type: 'number', defaultValue: 0, admin: { readOnly: true, position: 'sidebar' } },
  ],
}
