import type { CollectionConfig } from 'payload'

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'itemType', 'galleryCollection', 'createdAt'],
    group: 'Галерия',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { position: 'sidebar', description: 'Better Auth user ID (for customer wishlist)' },
    },
    {
      name: 'itemType',
      type: 'select',
      options: [
        { label: 'Gallery Image', value: 'gallery' },
        { label: 'Trip', value: 'trip' },
        { label: 'Program', value: 'program' },
        { label: 'Destination', value: 'destination' },
        { label: 'Product', value: 'product' },
      ],
      defaultValue: 'gallery',
      admin: { position: 'sidebar' },
    },
    {
      name: 'galleryCollection',
      type: 'relationship',
      relationTo: 'gallery-collections',
      admin: { position: 'sidebar', condition: (data) => !data.itemType || data.itemType === 'gallery' },
    },
    {
      name: 'imageIndex',
      type: 'number',
      admin: { description: 'Index of favorited image within the collection', condition: (data) => !data.itemType || data.itemType === 'gallery' },
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      admin: { position: 'sidebar', condition: (data) => data.itemType === 'trip' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: { position: 'sidebar', condition: (data) => data.itemType === 'program' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { position: 'sidebar', condition: (data) => data.itemType === 'destination' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { position: 'sidebar', condition: (data) => data.itemType === 'product' },
    },
  ],
}
