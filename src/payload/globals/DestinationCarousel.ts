import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)
import { revalidateGlobal } from '../hooks/revalidate'

const revalidateCarouselTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { revalidateTag('destination-carousel') })
  } catch { /* outside request scope */ }
  return doc
}

export const DestinationCarousel: GlobalConfig = {
  slug: 'destination-carousel',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/DestinationCarouselVisualEditorButton#DestinationCarouselVisualEditorButton',
        },
      },
    },
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'Дестинации',
    },
    {
      name: 'destinationSource',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Автоматично (всички дестинации)', value: 'auto' },
        { label: 'Ръчно избрани', value: 'manual' },
      ],
    },
    {
      name: 'selectedDestinations',
      type: 'array',
      label: 'Избрани дестинации (ръчно)',
      admin: {
        condition: (_, siblingData) => siblingData?.destinationSource === 'manual',
      },
      fields: [
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'destinations',
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
    afterChange: [revalidateCarouselTag, revalidateGlobal('/')],
  },
}
