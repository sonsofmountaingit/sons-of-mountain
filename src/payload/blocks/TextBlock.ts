import type { Block } from 'payload'

export const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Text Block', plural: 'Text Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'textarea' },
    {
      name: 'alignment',
      type: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: 'left',
    },
    {
      name: 'variant',
      type: 'select',
      options: ['full-width', 'contained', 'two-column', 'centered'],
      defaultValue: 'contained',
    },
    { name: 'bgColor', type: 'text' },
    { name: 'textColor', type: 'text' },
    {
      name: 'padding',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    {
      name: 'ctaText',
      type: 'text',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
  ],
}
