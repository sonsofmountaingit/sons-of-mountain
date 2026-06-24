import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckBlogEditorClient } from './PuckBlogEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'blog-page', depth: 0 })) as any

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'BlogHeroBlock',
        props: { id: 'blog-hero', heading: d?.heading ?? 'Блог', subheading: d?.subheading ?? 'Статии, съвети и вдъхновение за пътуване' },
      },
      {
        type: 'BlogPostsBlock',
        props: { id: 'blog-posts', title: '', limit: 12, layout: 'grid', _posts: [] },
      },
    ],
  }

  return <PuckBlogEditorClient initialData={puckData} />
}

export default function PuckBlogEditorPage() {
  return (
    <Suspense fallback={<div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>Loading Visual Editor…</div>}>
      <EditorContent />
    </Suspense>
  )
}
