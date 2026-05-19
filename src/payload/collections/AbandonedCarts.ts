import type { CollectionConfig } from 'payload'

export const AbandonedCarts: CollectionConfig = {
  slug: 'abandoned-carts',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'emailSentAt', 'updatedAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'cartData',
      type: 'json',
      admin: { readOnly: true, description: 'Cart items snapshot' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Recovered', value: 'recovered' },
        { label: 'Expired', value: 'expired' },
      ],
      defaultValue: 'active',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'emailSentAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
  timestamps: true,
}
