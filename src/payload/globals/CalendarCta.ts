import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag

export const CalendarCta: GlobalConfig = {
  slug: 'calendar-cta',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/CalendarCtaVisualEditorButton#CalendarCtaVisualEditorButton',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Търсиш следващото приключение?',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Разгледай всички предстоящи пътувания.',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Виж календара',
    },
    {
      name: 'buttonUrl',
      type: 'text',
      defaultValue: '/calendar',
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
          after(() => { try { revalidateTag('calendar-cta') } catch {} })
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
