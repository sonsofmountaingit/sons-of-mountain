import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'textarea' },
    { name: 'ctaText', type: 'text' },
    { name: 'ctaLink', type: 'text' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    {
      name: 'variant',
      type: 'select',
      options: ['default', 'centered', 'left-aligned', 'split'],
      defaultValue: 'default',
    },
    { name: 'bgColor', type: 'text', defaultValue: '#0a0a0a' },
    { name: 'textColor', type: 'text', defaultValue: '#ffffff' },
  ],
}
