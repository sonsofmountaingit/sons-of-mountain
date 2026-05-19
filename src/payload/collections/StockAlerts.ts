import type { CollectionConfig } from 'payload'

export const StockAlerts: CollectionConfig = {
  slug: 'stock-alerts',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'itemType', 'status', 'createdAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'itemType',
      type: 'select',
      required: true,
      options: [
        { label: 'Trip', value: 'trip' },
        { label: 'Product', value: 'product' },
        { label: 'Program', value: 'program' },
        { label: 'Destination', value: 'destination' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      admin: { condition: (data) => data.itemType === 'trip' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { condition: (data) => data.itemType === 'product' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: { condition: (data) => data.itemType === 'program' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { condition: (data) => data.itemType === 'destination' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Notified', value: 'notified' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'notifiedAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
