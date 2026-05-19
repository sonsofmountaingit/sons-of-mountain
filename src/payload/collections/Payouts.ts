import type { CollectionConfig } from 'payload'

export const Payouts: CollectionConfig = {
  slug: 'payouts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['recipient', 'trip', 'amount', 'status', 'paidAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar', description: 'Guide, photographer, or supplier' },
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      admin: { position: 'sidebar' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: { position: 'sidebar' },
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
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'paidAt',
      type: 'date',
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes (not shown to recipient)' },
    },
    {
      name: 'invoiceRef',
      type: 'text',
      admin: { description: 'External invoice or transfer reference number' },
    },
  ],
}
