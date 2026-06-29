import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckPrivacyPolicyEditorClient } from './PuckPrivacyPolicyEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const doc = (await payload.findGlobal({ slug: 'privacy-policy', depth: 1 })) as any

  const puckData: Data = doc?.puckData?.content?.length ? doc.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'PrivacyPolicyContentBlock',
        props: {
          id: 'privacy-policy-content',
          title: doc?.title ?? 'Политика за поверителност',
          lastUpdated: doc?.lastUpdated ?? '',
          content: doc?.content ?? null,
        },
      },
    ],
  }

  return <PuckPrivacyPolicyEditorClient initialData={puckData} />
}

export default function PuckPrivacyPolicyEditorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading Visual Editor…
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
