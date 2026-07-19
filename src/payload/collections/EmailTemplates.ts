import type { CollectionConfig } from 'payload'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: { group: 'Email Marketing', useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'previewText', type: 'text' },
    {
      name: 'contentType',
      type: 'select',
      required: true,
      defaultValue: 'richtext',
      options: [
        { label: 'Visual Builder (Maily drag-and-drop)', value: 'maily' },
        { label: 'Rich Text (Lexical editor)', value: 'richtext' },
        { label: 'Raw HTML', value: 'html' },
      ],
      admin: { description: 'Maily = visual drag-and-drop. RichText = formatted editor. HTML = paste your own code.' },
    },
    {
      name: 'mailyContent',
      type: 'json',
      admin: {
        condition: (data) => data.contentType === 'maily',
        description: 'Maily visual editor JSON. Edit via the drag-and-drop builder above.',
        components: { Field: '@/payload/components/MailyEditor#MailyEditor' },
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: { condition: (data) => data.contentType === 'richtext' },
    },
    {
      name: 'htmlContent',
      type: 'textarea',
      admin: {
        condition: (data) => data.contentType === 'html',
        description: 'Paste raw HTML. Merge tags like {{firstName}} are substituted at send time. The email shell is not added automatically.',
      },
    },
  ],
}
