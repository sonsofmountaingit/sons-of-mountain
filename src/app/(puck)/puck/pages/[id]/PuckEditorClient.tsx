'use client'

import { Puck, createUsePuck, type Data, blocksPlugin, fieldsPlugin, outlinePlugin } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface PuckEditorClientProps {
  pageId: string
  initialData: Data
  pageTitle: string
  pageSlug: string
  serverURL: string
}

async function savePuckData(pageId: string, data: Data): Promise<boolean> {
  const res = await fetch(`/api/puck/${pageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ puckData: data }),
  })
  return res.ok
}

const usePuckData = createUsePuck()

function PreviewButton({ pageId }: { pageId: string }) {
  const data = usePuckData((s: { appState: { data: Data } }) => s.appState.data)
  const [previewing, setPreviewing] = useState(false)

  async function handlePreview() {
    setPreviewing(true)
    try {
      const ok = await savePuckData(pageId, data)
      if (!ok) { alert('Save failed before preview. Please try again.'); return }
      window.open(`/preview/${pageId}`, '_blank')
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <button
      onClick={handlePreview}
      disabled={previewing}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '5px 10px', fontSize: 12, color: 'inherit', cursor: previewing ? 'default' : 'pointer',
        background: 'none', borderRadius: 4, border: '1px solid rgba(0,0,0,0.18)', marginRight: 6,
        opacity: previewing ? 0.45 : 0.75,
      }}
    >
      {previewing ? 'Saving…' : 'Preview ↗'}
    </button>
  )
}

export function PuckEditorClient({ pageId, initialData, pageTitle, pageSlug, serverURL }: PuckEditorClientProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handlePublish = useCallback(
    async (data: Data) => {
      setSaving(true)
      try {
        const ok = await savePuckData(pageId, data)
        if (!ok) { alert('Publish failed. Please try again.'); return }
        router.refresh()
      } finally {
        setSaving(false)
      }
    },
    [pageId, router],
  )

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={handlePublish}
      headerTitle={saving ? `${pageTitle} — Saving…` : pageTitle}
      headerPath={`/admin/collections/pages/${pageId}`}
      plugins={[blocksPlugin(), fieldsPlugin(), outlinePlugin()]}
      metadata={{ serverURL, pageId, pageSlug }}
      permissions={{ drag: true, duplicate: true, delete: true, insert: true, edit: true }}
      viewports={[
        {
          width: 1440, height: 900, label: 'Desktop',
          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
        },
        {
          width: 1024, height: 768, label: 'Laptop',
          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M2 20h20" /></svg>,
        },
        {
          width: 768, height: 1024, label: 'Tablet',
          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="1" fill="currentColor" /></svg>,
        },
        {
          width: 375, height: 812, label: 'Mobile',
          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2" /><circle cx="12" cy="18" r="1" fill="currentColor" /></svg>,
        },
      ]}
      _experimentalVirtualization
      overrides={{
        headerActions: ({ children }) => (
          <>
            <a
              href={`/admin/collections/pages/${pageId}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', fontSize: 12, color: 'inherit', textDecoration: 'none',
                borderRadius: 4, border: '1px solid rgba(0,0,0,0.18)', marginRight: 6, opacity: 0.75,
              }}
            >
              ← Admin
            </a>
            <PreviewButton pageId={pageId} />
            {children}
          </>
        ),
      }}
    />
  )
}
