import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckCalendarEditorClient } from './PuckCalendarEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'calendar-page', depth: 0 })) as any

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'CalendarHeroBlock',
        props: { id: 'calendar-hero', heading: d?.heading ?? 'Календар', subheading: d?.subheading ?? 'Предстоящи пътувания и програми по месец' },
      },
    ],
  }

  return <PuckCalendarEditorClient initialData={puckData} />
}

export default function PuckCalendarEditorPage() {
  return (
    <Suspense fallback={<div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>Loading Visual Editor…</div>}>
      <EditorContent />
    </Suspense>
  )
}
