import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckTestimonialsEditorClient } from './PuckTestimonialsEditorClient'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'testimonials-section' })) as any

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'TestimonialsMarqueeBlock',
        props: {
          id: 'testimonials-marquee-block',
          heading: d?.heading ?? 'Какво казват нашите клиенти',
          subheading: d?.subheading ?? 'Реални истории от реални пътешественици.',
        },
      },
    ],
  }

  return <PuckTestimonialsEditorClient initialData={puckData} />
}

export default function PuckTestimonialsEditorPage() {
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
