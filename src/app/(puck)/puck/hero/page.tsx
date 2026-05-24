import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckHeroEditorClient } from './PuckHeroEditorClient'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const h = (await payload.findGlobal({ slug: 'hero', depth: 2 })) as any

  const puckData: Data = h?.puckData?.content?.length ? h.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'HeroMainBlock',
        props: {
          id: 'hero-main',
          backgroundVideoUrl: '/hero-bg.mp4',
          overlayOpacity: 40,
          contentAlign: 'bottom-center',
          height: 'screen',
        },
      },
    ],
    zones: {
      'hero-main:hero-content': [
        {
          type: 'HeroHeadlineBlock',
          props: {
            id: 'hero-headline',
            text: h?.headline ?? 'Преоткривай света с нас!',
            fontSize: '4rem',
            color: '#ffffff',
            fontWeight: '700',
            textAlign: 'center',
          },
        },
        {
          type: 'HeroSubtextBlock',
          props: {
            id: 'hero-subtext',
            text: h?.subtext ?? 'Пътувай с Panic Frame там, където комфортът среща приключението.',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.65)',
            textAlign: 'center',
          },
        },
        {
          type: 'HeroCtaBlock',
          props: {
            id: 'hero-cta',
            label: h?.ctaLabel ?? 'Виж всички дестинации',
            url: h?.ctaUrl ?? '/destinations',
            style: 'filled-white',
            fontSize: '0.75rem',
            align: 'center',
          },
        },
      ],
    },
  }

  return <PuckHeroEditorClient initialData={puckData} />
}

export default function PuckHeroEditorPage() {
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
