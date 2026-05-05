import type { CollectionConfig } from 'payload'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'previewText', type: 'text' },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
