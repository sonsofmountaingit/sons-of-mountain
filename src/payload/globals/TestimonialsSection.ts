import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)

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
          after(() => { revalidateTag('testimonials') })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
