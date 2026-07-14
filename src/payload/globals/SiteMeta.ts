import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

export const SiteMeta: GlobalConfig = {
  slug: 'site-meta',
  label: 'SEO / Page Meta',
  admin: { group: 'Site Settings' },
  hooks: {
    afterChange: [() => { after(() => { try { revalidateTag('site-meta', 'max') } catch {} }) }],
  },
  fields: [
    {
      name: 'pages',
      type: 'array',
      labels: { singular: 'Page', plural: 'Pages' },
      admin: { description: 'SEO title/description/image for static (non-CMS-backed) routes. The "path" must match exactly, e.g. /destinations, /blog, /shop, /contact.' },
      fields: [
        { name: 'path', type: 'text', required: true, admin: { description: 'e.g. /destinations' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'keywords', type: 'text', admin: { description: 'Comma-separated keywords' } },
      ],
    },
    {
      name: 'defaultKeywords',
      type: 'text',
      admin: { description: 'Site-wide fallback keywords (comma-separated), used when a page has none set.' },
    },
  ],
}
