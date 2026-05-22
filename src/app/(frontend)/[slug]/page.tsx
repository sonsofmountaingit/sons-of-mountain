import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { LivePreviewBlocks } from '@/components/blocks/LivePreviewBlocks'
import { PuckRender } from '@/components/blocks/PuckRender'
import type { Data } from '@puckeditor/core'

type Args = { params: Promise<{ slug: string }> }

async function getPageCached(slug: string) {
  'use cache'
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: false,
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

async function getPageDraft(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageCached(slug)
  if (!page) return {}
  const meta = (page as { meta?: { title?: string; description?: string } }).meta
  return {
    title: meta?.title ?? (page as { title?: string }).title,
    description: meta?.description,
  }
}

async function PageContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise
  const { isEnabled: isDraft } = await draftMode()
  const page = isDraft ? await getPageDraft(slug) : await getPageCached(slug)
  if (!page) notFound()

  const puckData = (page as { puckData?: unknown }).puckData as Data | null | undefined

  if (puckData?.content?.length) {
    return <PuckRender data={puckData} />
  }

  const layout = ((page as { layout?: unknown[] }).layout ?? []) as Parameters<
    typeof BlockRenderer
  >[0]['blocks']

  if (isDraft) {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    return <LivePreviewBlocks initial={page as never} serverURL={serverURL} />
  }

  return <BlockRenderer blocks={layout} />
}

export default function Page({ params }: Args) {
  return (
    <Suspense fallback={null}>
      <PageContent paramsPromise={params} />
    </Suspense>
  )
}
