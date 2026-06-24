import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateStoriesPageTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('stories-page', 'max') } catch {} }) } catch {}
  return doc
}

export const StoriesPage: GlobalConfig = {
  slug: 'stories-page',
  label: 'Stories Page',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/StoriesPageVisualEditorButton#StoriesPageVisualEditorButton',
        },
      },
    },
    { name: 'heading', type: 'text', defaultValue: 'Истории' },
    { name: 'subheading', type: 'text', defaultValue: 'Разкази от нашите пътешественици' },
    { name: 'puckData', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [revalidateStoriesPageTag],
  },
}
