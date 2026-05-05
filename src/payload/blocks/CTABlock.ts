import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA Block', plural: 'CTA Blocks' },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonText', type: 'text' },
    { name: 'buttonLink', type: 'text' },
    { name: 'bgColor', type: 'text' },
    { name: 'textColor', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      options: ['default', 'centered', 'full-width'],
      defaultValue: 'centered',
    },
  ],
}
