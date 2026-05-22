import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'

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
          after(() => revalidateTag('featured-travels', 'default'))
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
