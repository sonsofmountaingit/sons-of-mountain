import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

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
    afterChange: [revalidateGlobal('/')],
  },
}
