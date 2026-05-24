import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'

export const TestimonialsSection: GlobalConfig = {
  slug: 'testimonials-section',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/TestimonialsVisualEditorButton#TestimonialsVisualEditorButton',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Какво казват нашите клиенти',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Реални истории от реални пътешественици.',
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          after(() => { revalidateTag('testimonials', 'max') })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
