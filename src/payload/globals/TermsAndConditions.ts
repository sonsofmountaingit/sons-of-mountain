import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag

const revalidateTermsTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { try { (revalidateTag as any)('terms-and-conditions', 'max') } catch {} })
  } catch { /* outside request scope */ }
  return doc
}

export const TermsAndConditions: GlobalConfig = {
  slug: 'terms-and-conditions',
  label: 'Общи условия',
  admin: { group: 'Site Settings' },
  versions: {
    drafts: true,
    max: 50,
  },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/TermsAndConditionsVisualEditorButton#TermsAndConditionsVisualEditorButton',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Общи условия',
    },
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Последна актуализация',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Съдържание',
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateTermsTag],
  },
}
