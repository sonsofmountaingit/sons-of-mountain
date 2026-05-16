'use client'

import { Puck, ActionBar, createUsePuck, resolveAllData, type Data, blocksPlugin, fieldsPlugin, outlinePlugin } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

async function saveGalleryPuckData(data: Data): Promise<boolean> {
  const res = await fetch('/api/puck/gallery', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ puckData: data }),
  })
  return res.ok
}

const AUTOSAVE_DEBOUNCE_MS = 2000

export function PuckGalleryEditorClient({ initialData }: { initialData: Data }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePublish = useCallback(async (data: Data) => {
    setSaving(true)
    try {
      const resolved = await resolveAllData(data, puckConfig)
      const ok = await saveGalleryPuckData(resolved)
      if (!ok) { alert('Publish failed. Please try again.'); return }
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [router])

  const handleAction = useCallback((action: { type: string }, appState: { data: Data }) => {
    const mutatingActions = new Set(['insert', 'remove', 'move', 'duplicate', 'set', 'setData'])
    if (!mutatingActions.has(action.type)) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      saveGalleryPuckData(appState.data).catch(() => {})
    }, AUTOSAVE_DEBOUNCE_MS)
  }, [])

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={handlePublish}
      onAction={handleAction}
      headerTitle={saving ? 'Gallery — Saving…' : 'Gallery'}
      headerPath="/admin/globals/gallery"
      plugins={[blocksPlugin(), fieldsPlugin(), outlinePlugin()]}
      permissions={{ drag: true, duplicate: true, delete: true, insert: true, edit: true }}
      iframe={{ enabled: true, waitForStyles: true }}
      viewports={[
        { width: 1440, height: 900, label: 'Desktop', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg> },
        { width: 375, height: 812, label: 'Mobile', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2" /><circle cx="12" cy="18" r="1" fill="currentColor" /></svg> },
      ]}
      overrides={{
        headerActions: ({ children }) => (
          <>
            <a
              href="/admin/globals/gallery"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 12, color: 'inherit', textDecoration: 'none', borderRadius: 4, border: '1px solid rgba(0,0,0,0.18)', marginRight: 6, opacity: 0.75 }}
            >
              ← Admin
            </a>
            {children}
          </>
        ),
      }}
    />
  )
}
