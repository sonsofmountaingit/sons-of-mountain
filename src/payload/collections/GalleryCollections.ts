import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateGallery = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('gallery-collections', 'max') }) } catch { /* noop */ }
  return doc
}
const revalidateGalleryDelete = () => {
  try { after(() => { revalidateTag('gallery-collections', 'max') }) } catch { /* noop */ }
}

export const GalleryCollections: CollectionConfig = {
  slug: 'gallery-collections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'photographer', 'destination', 'status', 'publishedAt'],
    group: 'Галерия',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug, e.g. "namibia-dunes"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'photographer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { position: 'sidebar' },
    },
    {
      name: 'latitude',
      type: 'number',
      admin: { position: 'sidebar', description: 'For map pin' },
    },
    {
      name: 'longitude',
      type: 'number',
      admin: { position: 'sidebar', description: 'For map pin' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show in "Избрани" filter' },
        },
        {
          name: 'takenAt',
          type: 'date',
          admin: { description: 'Date photo was taken, for "По дата" sort' },
        },
        {
          name: 'dominantColors',
          type: 'array',
          admin: { description: 'Auto-extracted color palette (warm/cool/mono)', readOnly: true },
          fields: [{ name: 'hex', type: 'text' }],
        },
      ],
    },
    {
      name: 'series',
      type: 'array',
      label: 'Series / Sub-albums',
      fields: [
        { name: 'seriesTitle', type: 'text', required: true },
        {
          name: 'images',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGallery],
    afterDelete: [revalidateGalleryDelete],
  },
}
