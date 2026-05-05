import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich Text Block', plural: 'Rich Text Blocks' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'variant',
      type: 'select',
      options: ['full-width', 'contained', 'centered'],
      defaultValue: 'contained',
    },
    { name: 'bgColor', type: 'text' },
    { name: 'textColor', type: 'text' },
  ],
}
