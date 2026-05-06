'use client'

import { Puck, createUsePuck, type Data, blocksPlugin, fieldsPlugin, outlinePlugin } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import { customFieldTypes } from '@/puck/customFields'
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

const categoryIcons: Record<string, React.ReactNode> = {
  layout: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>,
  content: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  conversion: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><path d="M12 2v20m-7-7h14M12 2l7 7m-14 0l7-7" /></svg>,
  media: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
  brand: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  dynamic: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
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
  FooterBlock: 'global',
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
      fieldTransforms={{
        colorPicker: customFieldTypes.colorPicker,
        datePicker: customFieldTypes.datePicker,
        timePicker: customFieldTypes.timePicker,
        urlPicker: customFieldTypes.urlPicker,
        slider: customFieldTypes.slider,
        toggle: customFieldTypes.toggle,
        tags: customFieldTypes.tags,
      }}
      overrides={{
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
      }}
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
