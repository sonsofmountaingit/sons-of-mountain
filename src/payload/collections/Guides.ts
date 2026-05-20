import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const Guides: CollectionConfig = {
  slug: 'guides',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'yearsExperience', 'updatedAt'],
    group: 'Пътувания',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      name: 'instagram',
      type: 'text',
      admin: { description: 'Instagram handle without @, e.g. emiliyian.nikolov' },
    },
    {
      name: 'specializations',
      type: 'array',
      admin: { description: 'Areas of expertise, e.g. Планинско туризмо, Фотография' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'yearsExperience',
      type: 'number',
      admin: { position: 'sidebar', description: 'Years of guiding experience' },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('guides', '/destinations')],
    afterDelete: [revalidateCollectionDelete('guides', '/destinations')],
  },
}
