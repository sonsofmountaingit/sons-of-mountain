import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckCalendarCtaEditorClient } from './PuckCalendarCtaEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'calendar-cta' })) as any

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'CalendarCtaBlock',
        props: {
          id: 'calendar-cta-block',
          heading: d?.heading ?? 'Търсиш следващото приключение?',
          subheading: d?.subheading ?? 'Разгледай всички предстоящи пътувания.',
          buttonText: d?.buttonText ?? 'Виж календара',
          buttonUrl: d?.buttonUrl ?? '/calendar',
        },
      },
    ],
  }

  return <PuckCalendarCtaEditorClient initialData={puckData} />
}

export default function PuckCalendarCtaEditorPage() {
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
