import type { Block } from 'payload'

export const MediaLogosBlock: Block = {
  slug: 'media-logos',
  labels: { singular: 'Media Logos Block', plural: 'Media Logos Blocks' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
