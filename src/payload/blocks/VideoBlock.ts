import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video Block', plural: 'Video Blocks' },
  fields: [
    { name: 'url', type: 'text', required: true },
    { name: 'poster', type: 'upload', relationTo: 'media' },
    { name: 'caption', type: 'text' },
    {
      name: 'autoPlay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
