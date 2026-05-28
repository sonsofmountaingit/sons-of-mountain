import type { CollectionConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)

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
          after(() => { revalidateTag('testimonials') })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          after(() => { revalidateTag('testimonials') })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
