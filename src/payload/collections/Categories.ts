import type { CollectionConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'sortOrder'],
    group: 'Shop',
  },
  hooks: {
    afterChange: [() => { after(() => revalidateTag('categories', 'max')) }],
    afterDelete: [() => { after(() => revalidateTag('categories', 'max')) }],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier' },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar', description: 'Parent category (leave empty for top-level)' },
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower number = higher position' },
    },
  ],
}
