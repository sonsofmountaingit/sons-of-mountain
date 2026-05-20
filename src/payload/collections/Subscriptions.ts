import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'stripeSubscriptionId',
    defaultColumns: ['customer', 'plan', 'status', 'createdAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'plan',
      type: 'select',
      options: [
        { label: 'Monthly Adventure Pass', value: 'monthly' },
        { label: 'Annual Adventure Pass', value: 'annual' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Trialing', value: 'trialing' },
      ],
      defaultValue: 'active',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'discountCode',
      type: 'relationship',
      relationTo: 'discount-codes',
      admin: { readOnly: true, description: 'Auto-created discount code for this subscriber' },
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe Price ID for this subscription plan', position: 'sidebar' },
    },
    {
      name: 'pausedAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'pastDueAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'dunningEmailsSent',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
