import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckGalleryEditorClient } from './PuckGalleryEditorClient'

async function EditorContent() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const g = (await payload.findGlobal({ slug: 'gallery', depth: 2 })) as any

  const puckData: Data = g?.puckData?.content?.length ? g.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'GalleryHeroBlock',
        props: {
          id: 'gallery-hero',
          heading: g?.heading ?? 'Фото галерии от нашите дестинации',
          subheading: g?.subheading ?? 'Разгледай снимки от наши приключения по света.',
          ctaLabel: g?.ctaLabel ?? 'Виж всички снимки',
        },
      },
      {
        type: 'GalleryGridBlock',
        props: {
          id: 'gallery-grid',
        },
      },
    ],
  }

  return <PuckGalleryEditorClient initialData={puckData} />
}

export default function PuckGalleryEditorPage() {
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
