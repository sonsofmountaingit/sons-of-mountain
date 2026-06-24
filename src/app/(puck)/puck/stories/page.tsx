import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckStoriesEditorClient } from './PuckStoriesEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'stories-page', depth: 0 })) as any

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'StoriesHeroBlock',
        props: { id: 'stories-hero', heading: d?.heading ?? 'Истории', subheading: d?.subheading ?? 'Разкази от нашите пътешественици' },
      },
      {
        type: 'StoriesBlock',
        props: { id: 'stories-grid', title: '', limit: 12, _stories: [] },
      },
    ],
  }

  return <PuckStoriesEditorClient initialData={puckData} />
}

export default function PuckStoriesEditorPage() {
  return (
    <Suspense fallback={<div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>Loading Visual Editor…</div>}>
      <EditorContent />
    </Suspense>
  )
}
