import type { CollectionConfig } from 'payload'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'itemType', 'position', 'status', 'createdAt'],
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
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'itemType',
      type: 'select',
      required: true,
      options: [
        { label: 'Trip', value: 'trip' },
        { label: 'Program', value: 'program' },
        { label: 'Destination', value: 'destination' },
        { label: 'Product', value: 'product' },
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { condition: (data) => data.itemType === 'product' },
    },
    {
      name: 'position',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar', description: 'Queue position' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Waiting', value: 'waiting' },
        { label: 'Notified', value: 'notified' },
        { label: 'Booked', value: 'booked' },
        { label: 'Expired', value: 'expired' },
      ],
      defaultValue: 'waiting',
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
