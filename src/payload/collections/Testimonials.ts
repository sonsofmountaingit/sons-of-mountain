import type { CollectionConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Content',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'row', 'updatedAt'],
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Автор',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Отзив',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Рейтинг (1-5)',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Снимка на автора',
    },
    {
      name: 'row',
      type: 'select',
      required: true,
      defaultValue: 'top',
      label: 'Ред',
      options: [
        { label: 'Горен ред (скролира вляво)', value: 'top' },
        { label: 'Долен ред (скролира вдясно)', value: 'bottom' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          after(() => { revalidateTag('testimonials', 'default') })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          after(() => { revalidateTag('testimonials', 'default') })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
