import type { Block } from 'payload'

export const StoriesBlock: Block = {
  slug: 'stories',
  labels: { singular: 'Stories Block', plural: 'Stories Blocks' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'stories',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
    },
  ],
}
