import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'trip', 'status', 'totalAmount', 'createdAt'],
  },
  fields: [
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'participantCount',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'dietaryNotes',
      type: 'textarea',
    },
    {
      name: 'questions',
      type: 'textarea',
    },
    {
      name: 'agreedToTerms',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'totalAmount',
      type: 'number',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'EUR',
    },
  ],
}
