import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckWhyTravelWithUsEditorClient } from './PuckWhyTravelWithUsEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const g = (await payload.findGlobal({ slug: 'why-travel-with-us', depth: 0 })) as any

  const puckData: Data = g?.puckData?.content?.length ? g.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'WhyTravelWithUsBlock',
        props: {
          id: 'why-travel-with-us-block',
          heading: g?.heading ?? 'ЗАЩО ДА ПЪТУВАШ С НАС?',
          items: g?.items ?? [
            { icon: 'camera', title: 'Автентичност', body: 'Пътувания, в които се сливаш с мястото, не просто го снимаш.' },
            { icon: 'globe', title: 'Общност', body: 'Малки групи от хора със сходен дух и жажда за приключения.' },
            { icon: 'city', title: 'Смисъл', body: 'Моменти, които остават в съзнанието дълго след като се приберeш.' },
          ],
        },
      },
    ],
  }

  return <PuckWhyTravelWithUsEditorClient initialData={puckData} />
}

export default function PuckWhyTravelWithUsEditorPage() {
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
