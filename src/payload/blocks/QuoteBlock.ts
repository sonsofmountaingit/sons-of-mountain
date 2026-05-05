import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Quote Block', plural: 'Quote Blocks' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text' },
    { name: 'role', type: 'text' },
  ],
}
