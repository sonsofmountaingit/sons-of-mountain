import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { PuckPageRenderer } from '@/components/blocks/PuckPageRenderer'
import type { Data } from '@puckeditor/core'

type Args = { params: Promise<{ id: string }> }

export default async function PuckPreviewPage({ params }: Args) {
  const { id } = await params
  const payload = await getPayload({ config })

  // Auth-protected — only logged-in Payload users can preview
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  let page: Record<string, unknown> | null = null
  try {
    // draft: true returns the latest auto-saved draft so preview shows unsaved changes
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

  return <PuckPageRenderer data={puckData} />
}
