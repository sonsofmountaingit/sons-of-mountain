import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateBlogPageTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('blog-page', 'max') } catch {} }) } catch {}
  return doc
}

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog Page',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/BlogPageVisualEditorButton#BlogPageVisualEditorButton',
        },
      },
    },
    { name: 'heading', type: 'text', defaultValue: 'Блог' },
    { name: 'subheading', type: 'text', defaultValue: 'Статии, съвети и вдъхновение за пътуване' },
    { name: 'puckData', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [revalidateBlogPageTag],
  },
}
