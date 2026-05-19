import type { CollectionConfig } from 'payload'

export const DiscountCodes: CollectionConfig = {
  slug: 'discount-codes',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'isActive', 'usedCount', 'expiresAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Discount code customers enter at checkout' },
    },
    {
      name: 'label',
      type: 'text',
      admin: { description: 'Internal label (not shown to customers)' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Visible and usable on storefront' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percent Off', value: 'percent' },
        { label: 'Fixed Amount Off', value: 'fixed' },
        { label: 'Bundle Deal', value: 'bundle' },
        { label: 'Corporate / Group', value: 'corporate' },
        { label: 'Referral', value: 'referral' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'value',
      type: 'number',
      admin: { description: 'Percent (0-100) or fixed EUR amount' },
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      admin: { description: 'Minimum order total in EUR to apply this code' },
    },
    {
      name: 'maxUses',
      type: 'number',
      admin: { description: 'Max total uses (leave empty = unlimited)' },
    },
    {
      name: 'usedCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'onePerCustomer',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'startsAt',
      type: 'date',
    },
    {
      name: 'expiresAt',
      type: 'date',
    },
    {
      name: 'applicableTo',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Trips Only', value: 'trips' },
        { label: 'Products Only', value: 'products' },
        { label: 'Programs Only', value: 'programs' },
        { label: 'Destinations Only', value: 'destinations' },
      ],
      defaultValue: 'all',
      admin: { position: 'sidebar' },
    },
    {
      name: 'bundleItems',
      type: 'array',
      admin: {
        description: 'Required items in cart to trigger bundle discount',
        condition: (data) => data.type === 'bundle',
      },
      fields: [
        {
          name: 'itemType',
          type: 'select',
          options: [
            { label: 'Trip', value: 'trip' },
            { label: 'Product', value: 'product' },
            { label: 'Program', value: 'program' },
          ],
          required: true,
        },
        { name: 'trip', type: 'relationship', relationTo: 'trips', admin: { condition: (_, s) => s?.itemType === 'trip' } },
        { name: 'product', type: 'relationship', relationTo: 'products', admin: { condition: (_, s) => s?.itemType === 'product' } },
        { name: 'program', type: 'relationship', relationTo: 'programs', admin: { condition: (_, s) => s?.itemType === 'program' } },
        { name: 'requiredCount', type: 'number', defaultValue: 1 },
      ],
    },
    {
      name: 'corporateTiers',
      type: 'array',
      admin: {
        description: 'Group size → discount tiers',
        condition: (data) => data.type === 'corporate',
      },
      fields: [
        { name: 'minPeople', type: 'number', required: true, admin: { description: 'Minimum participants' } },
        { name: 'discountPercent', type: 'number', required: true, admin: { description: 'Discount percentage' } },
      ],
    },
    {
      name: 'referredBy',
      type: 'relationship',
      relationTo: 'customers',
      admin: {
        description: 'Customer who owns this referral code (null = admin-created)',
        condition: (data) => data.type === 'referral',
      },
    },
    {
      name: 'usedByCustomers',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'customer', type: 'relationship', relationTo: 'customers' },
        { name: 'usedAt', type: 'date' },
      ],
    },
    {
      name: 'subscriptionId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe subscription ID (for Adventure Pass codes)' },
    },
  ],
}
