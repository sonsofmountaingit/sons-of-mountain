import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateCalendarPageTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('calendar-page', 'max') } catch {} }) } catch {}
  return doc
}

export const CalendarPage: GlobalConfig = {
  slug: 'calendar-page',
  label: 'Calendar Page',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/CalendarPageVisualEditorButton#CalendarPageVisualEditorButton',
        },
      },
    },
    { name: 'heading', type: 'text', defaultValue: 'Календар' },
    { name: 'subheading', type: 'text', defaultValue: 'Предстоящи пътувания и програми по месец' },
    { name: 'puckData', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [revalidateCalendarPageTag],
  },
}
