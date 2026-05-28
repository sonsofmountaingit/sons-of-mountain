import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckNavigationEditorClient } from './PuckNavigationEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const n = (await payload.findGlobal({ slug: 'navigation', depth: 2 })) as any

  const logoDarkUrl = typeof n?.logoDark === 'object' ? (n.logoDark?.url ?? '') : ''
  const logoLightUrl = typeof n?.logoLight === 'object' ? (n.logoLight?.url ?? '') : ''

  const puckData: Data = n?.puckData?.content?.length ? n.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'NavigationLinksBlock',
        props: {
          id: 'navigation-links',
          navLinksLeft: n?.navLinksLeft ?? [
            { label: 'ДЕСТИНАЦИИ', href: '/destinations' },
            { label: 'КАЛЕНДАР', href: '/calendar' },
            { label: 'ИСТОРИИ', href: '/stories' },
          ],
          navLinksRight: n?.navLinksRight ?? [
            { label: 'ГАЛЕРИЯ', href: '/gallery' },
            { label: 'БЛОГ', href: '/blog' },
            { label: 'ЗА НАС', href: '/about' },
            { label: 'КОНТАКТИ', href: '/contact' },
          ],
          instagramUrl: n?.instagramUrl ?? 'https://instagram.com/panicframe',
          facebookUrl: n?.facebookUrl ?? 'https://facebook.com/panicframe',
          tiktokUrl: n?.tiktokUrl ?? '',
          logoDarkUrl,
          logoLightUrl,
        },
      },
    ],
  }

  return <PuckNavigationEditorClient initialData={puckData} />
}

export default function PuckNavigationEditorPage() {
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
