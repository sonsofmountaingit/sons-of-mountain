import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'
import { revalidateGlobal } from '../hooks/revalidate'

const revalidateHeroTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { revalidateTag('hero', 'default') })
  } catch { /* outside request scope */ }
  return doc
}

export const Hero: GlobalConfig = {
  slug: 'hero',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/HeroVisualEditorButton#HeroVisualEditorButton',
        },
      },
    },
    {
      name: 'headline',
      type: 'text',
      defaultValue: 'Преоткривай света с нас!',
    },
    {
      name: 'subtext',
      type: 'text',
      defaultValue: 'Пътувай с Panic Frame там, където комфортът среща приключението.',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Виж всички дестинации',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/destinations',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'backgroundImageUrl',
      type: 'text',
      label: 'Background Image URL (fallback)',
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateHeroTag, revalidateGlobal('/')],
  },
}
