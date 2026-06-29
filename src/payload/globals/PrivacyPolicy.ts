import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag

const revalidatePrivacyPolicyTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { try { (revalidateTag as any)('privacy-policy', 'max') } catch {} })
  } catch { /* outside request scope */ }
  return doc
}

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Политика за поверителност',
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
          Field: '@/components/admin/PrivacyPolicyVisualEditorButton#PrivacyPolicyVisualEditorButton',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Политика за поверителност',
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
    afterChange: [revalidatePrivacyPolicyTag],
  },
}
