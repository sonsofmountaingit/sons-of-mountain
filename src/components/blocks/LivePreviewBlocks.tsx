'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { ClientBlockRenderer } from './ClientBlockRenderer'

type Block = { blockType: string } & Record<string, unknown>
type PageDoc = {
  id: string | number
  layout?: Block[]
  [key: string]: unknown
}

export function LivePreviewBlocks({ initial, serverURL }: { initial: PageDoc; serverURL: string }) {
  const { data } = useLivePreview<PageDoc>({
    initialData: initial,
    serverURL,
    depth: 2,
  })
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 8,
          right: 8,
          zIndex: 9999,
          background: 'rgba(0,200,0,0.85)',
          color: '#fff',
          padding: '4px 10px',
          fontSize: 11,
          fontFamily: 'monospace',
          borderRadius: 4,
          pointerEvents: 'none',
        }}
      >
        LIVE PREVIEW · blocks: {data?.layout?.length ?? 0}
      </div>
      <ClientBlockRenderer blocks={data?.layout ?? []} />
    </>
  )
}
