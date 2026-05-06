'use client'

import { Puck, ActionBar, createUsePuck, resolveAllData, type Data, blocksPlugin, fieldsPlugin, outlinePlugin } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

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

const categoryIcons: Record<string, React.ReactNode> = {
  layout: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  content: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  conversion: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><path d="M12 2v20m-7-7h14M12 2l7 7m-14 0l7-7"/></svg>,
  media: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  brand: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  dynamic: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
}

const componentToCategory: Record<string, string> = {
  Section: 'layout',
  HeroBlock: 'content',
  TextBlock: 'content',
  RichTextBlock: 'content',
  CTABlock: 'content',
  QuoteBlock: 'content',
  BannerBlock: 'content',
  SeparatorBlock: 'content',
  PricingBlock: 'conversion',
  NewsletterBlock: 'conversion',
  ContactFormBlock: 'conversion',
  BookingWidgetBlock: 'conversion',
  ImageGalleryBlock: 'media',
  GalleryLightboxBlock: 'media',
  VideoBlock: 'media',
  BeforeAfterBlock: 'media',
  EmbedBlock: 'media',
  MapBlock: 'media',
  TeamBlock: 'brand',
  MediaLogosBlock: 'brand',
  FAQBlock: 'brand',
  AccordionBlock: 'brand',
  TestimonialsGridBlock: 'brand',
  IconGridBlock: 'brand',
  FeatureCardsBlock: 'brand',
  CounterBlock: 'brand',
  TimelineBlock: 'brand',
  TabbedContentBlock: 'brand',
  StoriesBlock: 'dynamic',
  BlogPostsBlock: 'dynamic',
  DestinationCarouselBlock: 'dynamic',
  SocialFeedBlock: 'dynamic',
}

const knownTypes = new Set(Object.keys(puckConfig.components))

function sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (v === '') out[k] = undefined
    else if (v !== null && typeof v === 'object' && !Array.isArray(v)) out[k] = sanitizeProps(v as Record<string, unknown>)
    else out[k] = v
  }
  return out
}

function sanitizeData(data: Data): Data {
  return {
    root: data.root ?? { props: {} },
    content: (data.content ?? [])
      .filter((item) => item && item.type && knownTypes.has(item.type) && item.props != null)
      .map((item) => ({ ...item, props: sanitizeProps(item.props as Record<string, unknown>) })),
  }
}

// ── Auto-save: debounce writes on every action ────────────────────────────────

const AUTOSAVE_DEBOUNCE_MS = 2000

// ── IframeStyleInjector: injects global CSS vars + fonts into the editor iframe ─

function IframeStyleInjector({ document: iframeDoc, children }: { document: Document | null; children: React.ReactNode }) {
  useEffect(() => {
    if (!iframeDoc) return
    const style = iframeDoc.createElement('style')
    style.id = '__puck-host-styles__'
    style.textContent = `
      :root {
        --color-bg: #0a0a0a;
        --color-text: #f5f5f5;
        --color-accent: #e8d5b0;
      }
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; background: var(--color-bg); color: var(--color-text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    `
    if (!iframeDoc.getElementById('__puck-host-styles__')) {
      iframeDoc.head.appendChild(style)
    }
    return () => { iframeDoc.getElementById('__puck-host-styles__')?.remove() }
  }, [iframeDoc])
  return <>{children}</>
}

export function PuckEditorClient({ pageId, initialData, pageTitle, pageSlug, serverURL }: PuckEditorClientProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 13. resolveAllData before publishing — flushes all resolveData before saving
  const handlePublish = useCallback(
    async (data: Data) => {
      setSaving(true)
      try {
        const resolved = await resolveAllData(data, puckConfig)
        const ok = await savePuckData(pageId, resolved)
        if (!ok) { alert('Publish failed. Please try again.'); return }
        router.refresh()
      } finally {
        setSaving(false)
      }
    },
    [pageId, router],
  )

  // 1. onAction — debounced auto-save on every mutation action
  const handleAction = useCallback(
    (action: { type: string }, appState: { data: Data }) => {
      const mutatingActions = new Set(['insert', 'remove', 'move', 'duplicate', 'set', 'setData', 'registerZone', 'unregisterZone'])
      if (!mutatingActions.has(action.type)) return
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
      autosaveTimer.current = setTimeout(() => {
        savePuckData(pageId, appState.data).catch(() => {})
      }, AUTOSAVE_DEBOUNCE_MS)
    },
    [pageId],
  )

  return (
    <Puck
      config={puckConfig}
      data={sanitizeData(initialData)}
      onPublish={handlePublish}
      // 1. onAction: auto-save after mutations
      onAction={handleAction}
      // 2. initialHistory: seed history with the loaded data so undo works from load
      initialHistory={{
        histories: [{ id: 'initial', state: { data: sanitizeData(initialData) } as any }],
        index: 0,
        appendData: false,
      }}
      headerTitle={saving ? `${pageTitle} — Saving…` : pageTitle}
      headerPath={`/admin/collections/pages/${pageId}`}
      plugins={[blocksPlugin(), fieldsPlugin(), outlinePlugin()]}
      metadata={{ serverURL, pageId, pageSlug }}
      permissions={{ drag: true, duplicate: true, delete: true, insert: true, edit: true }}
      // 3. iframe: explicit config; enabled keeps viewports working, waitForStyles prevents flash
      iframe={{ enabled: true, waitForStyles: true }}
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
        // 11. actionBar: wrap with ActionBar component, expose label
        actionBar: ({ children, label, parentAction }) => (
          <ActionBar label={label}>
            {parentAction && <ActionBar.Group>{parentAction}</ActionBar.Group>}
            <ActionBar.Group>{children}</ActionBar.Group>
          </ActionBar>
        ),
        drawerItem: ({ name, children }) => {
          const category = componentToCategory[name as keyof typeof componentToCategory]
          const icon = category ? categoryIcons[category] : null
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              {icon && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.7 }}>{icon}</span>}
              <span>{children}</span>
            </div>
          )
        },
        // 3 (continued). iframe override: inject CSS vars + base styles into editor iframe
        iframe: ({ children, document: iframeDoc }) => (
          <IframeStyleInjector document={iframeDoc ?? null}>{children}</IframeStyleInjector>
        ),
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
