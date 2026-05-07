import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckHeroEditorClient } from './PuckHeroEditorClient'

async function EditorContent() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const h = (await payload.findGlobal({ slug: 'hero', depth: 2 })) as any
  const bgUrl = (typeof h?.backgroundImage === 'object' && h?.backgroundImage?.url)
    ? h.backgroundImage.url
    : (h?.backgroundImageUrl ?? '')

  const puckData: Data = h?.puckData?.content?.length ? h.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'HeroMainBlock',
        props: {
          id: 'hero-main',
          headline: h?.headline ?? 'Преоткривай света с нас!',
          subtext: h?.subtext ?? 'Пътувай с Panic Frame там, където комфортът среща приключението.',
          ctaLabel: h?.ctaLabel ?? 'Виж всички дестинации',
          ctaUrl: h?.ctaUrl ?? '/destinations',
          backgroundImageUrl: bgUrl,
        },
      },
    ],
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
