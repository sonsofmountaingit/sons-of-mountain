'use client'

import { Puck, ActionBar, resolveAllData, type Data, blocksPlugin, fieldsPlugin, outlinePlugin } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

async function saveData(data: Data): Promise<boolean> {
  const res = await fetch('/api/puck/featured-travels', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ puckData: data }),
  })
  return res.ok
}

const AUTOSAVE_MS = 2000

function IframeStyleInjector({ document: iframeDoc, children }: { document: Document | null; children: React.ReactNode }) {
  useEffect(() => {
    if (!iframeDoc) return
    const style = iframeDoc.createElement('style')
    style.id = '__puck-host-styles__'
    style.textContent = `
      :root { --color-bg: #ffffff; --color-text: #1a1a1a; }
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; background: var(--color-bg); color: var(--color-text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    `
    if (!iframeDoc.getElementById('__puck-host-styles__')) iframeDoc.head.appendChild(style)
    return () => { iframeDoc.getElementById('__puck-host-styles__')?.remove() }
  }, [iframeDoc])
  return <>{children}</>
}

export function PuckFeaturedTravelsEditorClient({ initialData }: { initialData: Data }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePublish = useCallback(async (data: Data) => {
    setSaving(true)
    try {
      const resolved = await resolveAllData(data, puckConfig)
      const ok = await saveData(resolved)
      if (!ok) { alert('Publish failed. Please try again.'); return }
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [router])

  const handleAction = useCallback((action: { type: string }, appState: { data: Data }) => {
    const mutating = new Set(['insert', 'remove', 'move', 'duplicate', 'set', 'setData', 'registerZone', 'unregisterZone'])
    if (!mutating.has(action.type)) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => saveData(appState.data).catch(() => {}), AUTOSAVE_MS)
  }, [])

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={handlePublish}
      onAction={handleAction}
      initialHistory={{ histories: [{ id: 'initial', state: { data: initialData } as any }], index: 0, appendData: false }}
      headerTitle={saving ? 'Featured Travels — Saving…' : 'Featured Travels'}
      headerPath="/admin/globals/featured-travels"
      plugins={[blocksPlugin(), fieldsPlugin(), outlinePlugin()]}
      permissions={{ drag: true, duplicate: true, delete: true, insert: true, edit: true }}
      iframe={{ enabled: true, waitForStyles: true }}
      viewports={[
        { width: 1440, height: 900, label: 'Desktop', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg> },
        { width: 375, height: 812, label: 'Mobile', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2" /><circle cx="12" cy="18" r="1" fill="currentColor" /></svg> },
      ]}
      _experimentalVirtualization
      overrides={{
        actionBar: ({ children, label, parentAction }) => (
          <ActionBar label={label}>
            {parentAction && <ActionBar.Group>{parentAction}</ActionBar.Group>}
            <ActionBar.Group>{children}</ActionBar.Group>
          </ActionBar>
        ),
        iframe: ({ children, document: iframeDoc }) => (
          <IframeStyleInjector document={iframeDoc ?? null}>{children}</IframeStyleInjector>
        ),
        headerActions: ({ children }) => (
          <>
            <a href="/admin/globals/featured-travels" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 12, color: 'inherit', textDecoration: 'none', borderRadius: 4, border: '1px solid rgba(0,0,0,0.18)', marginRight: 6, opacity: 0.75 }}>
              ← Admin
            </a>
            {children}
          </>
        ),
      }}
    />
  )
}
