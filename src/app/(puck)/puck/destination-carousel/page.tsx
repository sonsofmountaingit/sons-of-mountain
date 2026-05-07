import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckDestinationCarouselEditorClient } from './PuckDestinationCarouselEditorClient'

async function EditorContent() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const c = (await payload.findGlobal({ slug: 'destination-carousel', depth: 2 })) as any
  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    limit: 50,
    sort: 'name',
    depth: 2,
  })

  const mappedDestinations = destinations.map((d: any) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    heroImage: typeof d.heroImage === 'object' ? d.heroImage : null,
  }))

  const puckData: Data = c?.puckData?.content?.length ? c.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'HomeDestCarouselBlock',
        props: {
          id: 'destination-carousel-main',
          sectionTitle: c?.sectionTitle ?? 'Дестинации',
          destinations: mappedDestinations,
        },
      },
    ],
  }

  return <PuckDestinationCarouselEditorClient initialData={puckData} />
}

export default function PuckDestinationCarouselEditorPage() {
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
