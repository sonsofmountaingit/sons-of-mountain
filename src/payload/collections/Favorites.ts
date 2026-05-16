import type { CollectionConfig } from 'payload'

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'galleryCollection', 'createdAt'],
    group: 'Галерия',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'galleryCollection',
      type: 'relationship',
      relationTo: 'gallery-collections',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'imageIndex',
      type: 'number',
      admin: { description: 'Index of favorited image within the collection' },
    },
  ],
}
