import type { CollectionConfig } from 'payload'

export const GiftVouchers: CollectionConfig = {
  slug: 'gift-vouchers',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'recipientEmail', 'amount', 'status', 'createdAt'],
    group: 'Shop',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.code) {
          data.code = `SOM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      unique: true,
      admin: { readOnly: true, description: 'Авто-генериран код' },
    },
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true, description: 'Better Auth ID на купувача' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { readOnly: true },
    },
    {
      name: 'recipientEmail',
      type: 'email',
    },
    {
      name: 'recipientName',
      type: 'text',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'EUR',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Активен', value: 'active' },
        { label: 'Използван', value: 'redeemed' },
        { label: 'Изтекъл', value: 'expired' },
        { label: 'Отказан', value: 'cancelled' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
    },
    {
      name: 'redeemedAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'redeemedByCustomerId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'forDestination',
      type: 'relationship',
      relationTo: 'destinations',
    },
    {
      name: 'forTrip',
      type: 'relationship',
      relationTo: 'trips',
    },
    {
      name: 'forProgram',
      type: 'relationship',
      relationTo: 'programs',
    },
    {
      name: 'isStorefrontPurchasable',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show as purchasable gift voucher on storefront' },
    },
    {
      name: 'senderName',
      type: 'text',
      admin: { description: 'Name of the person gifting' },
    },
    {
      name: 'senderEmail',
      type: 'email',
      admin: { description: 'Email of the gifter (receives confirmation)' },
    },
    {
      name: 'deliveryDate',
      type: 'date',
      admin: { description: 'Schedule email delivery (leave empty = immediate on payment)' },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      admin: { description: 'Gift card visual image' },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: { description: 'Лично послание от купувача' },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
