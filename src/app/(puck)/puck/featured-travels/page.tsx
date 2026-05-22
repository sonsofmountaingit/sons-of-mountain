import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckFeaturedTravelsEditorClient } from './PuckFeaturedTravelsEditorClient'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const g = (await payload.findGlobal({ slug: 'featured-travels', depth: 0 })) as any

  const puckData: Data = g?.puckData?.content?.length ? g.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'FeaturedTravelsBlock',
        props: {
          id: 'featured-travels-block',
          heading: g?.heading ?? 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ',
        },
      },
    ],
  }

  return <PuckFeaturedTravelsEditorClient initialData={puckData} />
}

export default function PuckFeaturedTravelsEditorPage() {
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
