import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)
export const FeaturedTravels: GlobalConfig = {
  slug: 'featured-travels',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/FeaturedTravelsVisualEditorButton#FeaturedTravelsVisualEditorButton',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: ['destinations', 'trips', 'programs'] as const,
      hasMany: true,
      admin: {
        description: 'Изберете дестинации, пътувания или програми за показване в мрежата',
      },
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          after(() => {
            revalidateTag('featured-travels')
          })
        } catch {}
        return doc
      },
    ],
  },
}
