import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag
import { revalidateGlobal } from '../hooks/revalidate'

const revalidateHeroTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { try { revalidateTag('hero', 'max') } catch {} })
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
      defaultValue: 'Преходи, пътешествия и експедиции в България и по света!',
    },
    {
      name: 'subtext',
      type: 'text',
      defaultValue: 'Пътувай с Sons of Mountains там, където комфортът среща приключението.',
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
