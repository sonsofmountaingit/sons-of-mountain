import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { revalidateGlobal } from '../hooks/revalidate'

const revalidateNavigationTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('navigation') }) } catch { /* noop */ }
  return doc
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Logo for dark backgrounds' },
    },
    {
      name: 'logoLight',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Logo for light backgrounds' },
    },
    {
      name: 'navLinksLeft',
      type: 'array',
      label: 'Left Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'navLinksRight',
      type: 'array',
      label: 'Right Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'instagramUrl',
      type: 'text',
    },
    {
      name: 'facebookUrl',
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [revalidateNavigationTag, revalidateGlobal('/')],
  },
}
