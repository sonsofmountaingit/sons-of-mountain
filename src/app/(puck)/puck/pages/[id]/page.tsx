import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckEditorClient } from './PuckEditorClient'
import { payloadLayoutToPuck } from '@/puck/converter'

type Args = { params: Promise<{ id: string }> }

const EMPTY_DATA: Data = { content: [], root: { props: {} } }

async function EditorContent({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise
  const payload = await getPayload({ config })

  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  let page: Record<string, unknown> | null = null
  try {
    page = (await payload.findByID({ collection: 'pages', id, draft: true })) as Record<string, unknown>
  } catch {
    notFound()
  }
  if (!page) notFound()

  const savedPuckData = page.puckData as Data | null | undefined
  const layout = (page.layout as Record<string, unknown>[]) ?? []
  const puckData: Data =
    savedPuckData?.content?.length
      ? savedPuckData
      : layout.length
        ? payloadLayoutToPuck(layout)
        : EMPTY_DATA

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

  return (
    <PuckEditorClient
      pageId={id}
      initialData={puckData}
      pageTitle={(page.title as string) ?? 'Page'}
      pageSlug={(page.slug as string) ?? ''}
      serverURL={serverURL}
    />
  )
}

export default function PuckEditorPage({ params }: Args) {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading Visual Editor…
        </div>
      }
    >
      <EditorContent paramsPromise={params} />
    </Suspense>
  )
}
