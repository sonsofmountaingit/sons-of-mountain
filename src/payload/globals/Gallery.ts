import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateGalleryTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { revalidateTag('gallery') })
  } catch { /* outside request scope */ }
  return doc
}

export const Gallery: GlobalConfig = {
  slug: 'gallery',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/GalleryVisualEditorButton#GalleryVisualEditorButton',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Фото галерии от нашите дестинации',
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue: 'Разгледай снимки от наши приключения по света. Всяка галерия е история, уловена в кадър.',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Виж всички снимки',
    },
    {
      name: 'featuredCollections',
      type: 'array',
      label: 'Featured collections (shown on main gallery page)',
      fields: [
        {
          name: 'collection',
          type: 'relationship',
          relationTo: 'gallery-collections',
          required: true,
        },
      ],
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateGalleryTag],
  },
}
