'use client'

import { Puck, ActionBar, createUsePuck, resolveAllData, type Data, blocksPlugin, fieldsPlugin, outlinePlugin } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

async function save(data: Data): Promise<boolean> {
  const res = await fetch('/api/puck/calendar-cta', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ puckData: data }),
  })
  return res.ok
}

const AUTOSAVE_MS = 2000

export function PuckCalendarCtaEditorClient({ initialData }: { initialData: Data }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePublish = useCallback(async (data: Data) => {
    setSaving(true)
    try {
      const resolved = await resolveAllData(data, puckConfig)
      const ok = await save(resolved)
      if (!ok) { alert('Publish failed.'); return }
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [router])

  const handleAction = useCallback((action: { type: string }, appState: { data: Data }) => {
    const mutating = new Set(['insert', 'remove', 'move', 'duplicate', 'set', 'setData'])
    if (!mutating.has(action.type)) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => { save(appState.data).catch(() => {}) }, AUTOSAVE_MS)
  }, [])

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={handlePublish}
      onAction={handleAction}
      initialHistory={{ histories: [{ id: 'initial', state: { data: initialData } as any }], index: 0, appendData: false }}
      headerTitle={saving ? 'Calendar CTA — Saving…' : 'Calendar CTA'}
      headerPath="/admin/globals/calendar-cta"
      plugins={[blocksPlugin(), fieldsPlugin(), outlinePlugin()]}
      permissions={{ drag: true, duplicate: true, delete: true, insert: true, edit: true }}
      iframe={{ enabled: true, waitForStyles: true }}
      viewports={[
        { width: 1440, height: 900, label: 'Desktop', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg> },
        { width: 375, height: 812, label: 'Mobile', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2" /><circle cx="12" cy="18" r="1" fill="currentColor" /></svg> },
      ]}
      overrides={{
        actionBar: ({ children, label, parentAction }) => (
          <ActionBar label={label}>
            {parentAction && <ActionBar.Group>{parentAction}</ActionBar.Group>}
            <ActionBar.Group>{children}</ActionBar.Group>
          </ActionBar>
        ),
        headerActions: ({ children }) => (
          <>
            <a href="/admin/globals/calendar-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 12, color: 'inherit', textDecoration: 'none', borderRadius: 4, border: '1px solid rgba(0,0,0,0.18)', marginRight: 6, opacity: 0.75 }}>
              ← Admin
            </a>
            {children}
          </>
        ),
      }}
    />
  )
}
