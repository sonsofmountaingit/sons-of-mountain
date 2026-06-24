import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateHomePageTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('home-page', 'max') } catch {} }) } catch {}
  return doc
}

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/HomePageVisualEditorButton#HomePageVisualEditorButton',
        },
      },
    },
    { name: 'puckData', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [revalidateHomePageTag],
  },
}
