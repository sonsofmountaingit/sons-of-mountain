import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { PuckRender } from '@/components/blocks/PuckRender'
import type { Data } from '@puckeditor/core'

type Args = { params: Promise<{ id: string }> }

async function PageContent({ params }: Args) {
  const { id } = await params
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

  const puckData = page.puckData as Data | null | undefined
  if (!puckData?.content?.length) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
        No content yet. Add blocks in the visual editor and click Preview again.
      </div>
    )
  }

  return <PuckRender data={puckData} />
}

export default async function PuckPreviewPage({ params }: Args) {
  return (
    <Suspense fallback={<div style={{ padding: '4rem' }}>Loading...</div>}>
      <PageContent params={params} />
    </Suspense>
  )
}
