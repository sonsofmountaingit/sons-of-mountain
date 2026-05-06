'use client'

import type { CustomField, ExternalField } from '@puckeditor/core'

// ── Color picker ──────────────────────────────────────────────────────────────

export const colorField = (label: string, labelIcon?: React.ReactElement): CustomField<string> => ({
  type: 'custom',
  label,
  labelIcon,
  render: ({ value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 32 }}>
          {labelIcon}
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.6)' }}>{label}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="color"
          value={value && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 32, height: 32, padding: 2, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, cursor: 'pointer', flexShrink: 0 }}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. #fff or rgba(0,0,0,0.5)"
          style={{ flex: 1, padding: '4px 8px', fontSize: 13, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, minWidth: 0 }}
        />
        {value && (
          <button onClick={() => onChange('')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'rgba(0,0,0,0.4)', padding: 0, lineHeight: 1 }}>×</button>
        )}
      </div>
    </div>
  ),
})

// ── Media picker ──────────────────────────────────────────────────────────────

export const payloadMediaField = (label: string): ExternalField<string> => ({
  type: 'external',
  label,
  placeholder: 'Search media library…',
  showSearch: true,
  fetchList: async ({ query }) => {
    try {
      const qs = query ? `&where[alt][contains]=${encodeURIComponent(query)}` : ''
      const res = await fetch(`/api/media?limit=40&depth=0${qs}`, { credentials: 'include' })
      if (!res.ok) return null
      const json = await res.json()
      return (json.docs ?? []) as Record<string, unknown>[]
    } catch { return null }
  },
  mapProp: (doc: Record<string, unknown>) => (doc.url as string) ?? '',
  mapRow: (doc: Record<string, unknown>) => ({
    filename: String(doc.filename ?? ''),
    alt: String(doc.alt ?? ''),
    type: String(doc.mimeType ?? ''),
  }),
  getItemSummary: (url: string) => url || 'Image',
})

// ── Padding / spacing presets ─────────────────────────────────────────────────

const PAD_OPTIONS = [
  { value: '0', label: 'None' },
  { value: '1rem', label: 'XS (1rem)' },
  { value: '2rem', label: 'Small (2rem)' },
  { value: '3rem', label: 'Medium (3rem)' },
  { value: '4rem', label: 'Default (4rem)' },
  { value: '6rem', label: 'Large (6rem)' },
  { value: '8rem', label: 'XL (8rem)' },
  { value: '12rem', label: 'XXL (12rem)' },
]

const PAD_X_OPTIONS = [
  { value: '', label: 'Default (24px)' },
  { value: '1rem', label: '1rem' },
  { value: '2rem', label: '2rem' },
  { value: '4rem', label: '4rem' },
  { value: '6rem', label: '6rem' },
  { value: '8rem', label: '8rem' },
]

const MAX_WIDTH_OPTIONS = [
  { value: '', label: 'None (full)' },
  { value: '480px', label: 'XS (480px)' },
  { value: '768px', label: 'Small (768px)' },
  { value: '960px', label: 'Medium (960px)' },
  { value: '1200px', label: 'Large (1200px)' },
  { value: '1440px', label: 'Wide (1440px)' },
]

const SIZE_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: '100px', label: '100px' },
  { value: '200px', label: '200px' },
  { value: '300px', label: '300px' },
  { value: '400px', label: '400px' },
  { value: '500px', label: '500px' },
  { value: '600px', label: '600px' },
  { value: '800px', label: '800px' },
  { value: '100%', label: '100%' },
  { value: '50vh', label: '50vh' },
  { value: '75vh', label: '75vh' },
  { value: '100vh', label: '100vh' },
]

const MARGIN_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'auto', label: 'Auto' },
  { value: '0.5rem', label: '0.5rem' },
  { value: '1rem', label: '1rem' },
  { value: '2rem', label: '2rem' },
  { value: '3rem', label: '3rem' },
  { value: '4rem', label: '4rem' },
  { value: '6rem', label: '6rem' },
  { value: '8rem', label: '8rem' },
]

// ── Free-value dimension field (text input with unit) ─────────────────────────

export const dimensionField = (label: string): CustomField<string> => ({
  type: 'custom',
  label,
  render: ({ value, onChange }) => (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. 400px, 50vh, 100%, auto"
      style={{ width: '100%', padding: '4px 8px', fontSize: 13, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }}
    />
  ),
})

// ── All style fields (spread into any block's fields) ─────────────────────────

export const BG_ICON = <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="2"/></svg>
export const TEXT_ICON = <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
export const LINK_ICON = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>

export function allStyleFields() {
  return {
    // ── Background ──────────────────────────────────────────────────────────
    bgColor: colorField('Background Color', BG_ICON),
    bgGradientFrom: colorField('Gradient Start Color'),
    bgGradientTo: colorField('Gradient End Color'),
    bgGradientDir: {
      type: 'select' as const,
      label: 'Gradient Direction',
      options: [
        { value: '180deg', label: 'Top → Bottom' },
        { value: '90deg', label: 'Left → Right' },
        { value: '135deg', label: 'TL → BR' },
        { value: '45deg', label: 'BL → TR' },
      ],
    },
    bgImage: payloadMediaField('Background Image'),
    bgImagePosition: {
      type: 'select' as const,
      label: 'Image Position',
      options: [
        { value: 'center', label: 'Center' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
    bgImageOverlayColor: colorField('Image Overlay Color'),
    bgImageOverlayOpacity: {
      type: 'select' as const,
      label: 'Image Overlay Opacity',
      options: [
        { value: '0', label: 'None' }, { value: '0.2', label: '20%' },
        { value: '0.4', label: '40%' }, { value: '0.5', label: '50%' },
        { value: '0.6', label: '60%' }, { value: '0.7', label: '70%' },
        { value: '0.8', label: '80%' }, { value: '0.9', label: '90%' },
      ],
    },
    // ── Typography ──────────────────────────────────────────────────────────
    textColor: colorField('Text Color', TEXT_ICON),
    textAlign: {
      type: 'radio' as const,
      label: 'Text Alignment',
      options: [{ value: '', label: 'Default' }, { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }],
    },
    fontSize: {
      type: 'select' as const,
      label: 'Base Font Size',
      options: [
        { value: '', label: 'Default' }, { value: '0.875rem', label: 'Small (14px)' },
        { value: '1rem', label: 'Base (16px)' }, { value: '1.125rem', label: 'Large (18px)' },
        { value: '1.25rem', label: 'XL (20px)' },
      ],
    },
    fontWeight: {
      type: 'select' as const,
      label: 'Font Weight',
      options: [
        { value: '', label: 'Default' }, { value: '300', label: 'Light' }, { value: '400', label: 'Regular' },
        { value: '500', label: 'Medium' }, { value: '600', label: 'Semibold' }, { value: '700', label: 'Bold' },
      ],
    },
    letterSpacing: {
      type: 'select' as const,
      label: 'Letter Spacing',
      options: [
        { value: '', label: 'Default' }, { value: '-0.02em', label: 'Tight' }, { value: '0', label: 'Normal' },
        { value: '0.05em', label: 'Wide' }, { value: '0.1em', label: 'Wider' }, { value: '0.2em', label: 'Widest' },
      ],
    },
    lineHeight: {
      type: 'select' as const,
      label: 'Line Height',
      options: [
        { value: '', label: 'Default' }, { value: '1', label: 'Compact (1)' }, { value: '1.3', label: 'Tight (1.3)' },
        { value: '1.5', label: 'Normal (1.5)' }, { value: '1.7', label: 'Relaxed (1.7)' }, { value: '2', label: 'Loose (2)' },
      ],
    },
    // ── Spacing ─────────────────────────────────────────────────────────────
    paddingTop: { type: 'select' as const, label: 'Padding Top', options: PAD_OPTIONS },
    paddingBottom: { type: 'select' as const, label: 'Padding Bottom', options: PAD_OPTIONS },
    paddingX: { type: 'select' as const, label: 'Horizontal Padding', options: PAD_X_OPTIONS },
    contentMaxWidth: { type: 'select' as const, label: 'Content Max Width', options: MAX_WIDTH_OPTIONS },
    // ── Border & Shadow ─────────────────────────────────────────────────────
    borderRadius: {
      type: 'select' as const,
      label: 'Border Radius',
      options: [
        { value: '', label: 'None' }, { value: '4px', label: 'XS (4px)' }, { value: '8px', label: 'Small (8px)' },
        { value: '16px', label: 'Medium (16px)' }, { value: '24px', label: 'Large (24px)' },
        { value: '32px', label: 'XL (32px)' }, { value: '9999px', label: 'Pill' },
      ],
    },
    borderWidth: {
      type: 'select' as const,
      label: 'Border Width',
      options: [{ value: 'none', label: 'None' }, { value: '1px', label: '1px' }, { value: '2px', label: '2px' }, { value: '4px', label: '4px' }],
    },
    borderColor: colorField('Border Color'),
    boxShadow: {
      type: 'select' as const,
      label: 'Box Shadow',
      options: [
        { value: 'none', label: 'None' }, { value: 'sm', label: 'Subtle' }, { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }, { value: 'xl', label: 'XL' }, { value: 'glow', label: 'Glow' },
      ],
    },
    // ── Sizing ──────────────────────────────────────────────────────────────
    width: dimensionField('Width'),
    height: dimensionField('Height'),
    minHeight: { type: 'select' as const, label: 'Min Height', options: SIZE_OPTIONS },
    maxHeight: { type: 'select' as const, label: 'Max Height', options: SIZE_OPTIONS },
    // ── Margin ──────────────────────────────────────────────────────────────
    marginTop: { type: 'select' as const, label: 'Margin Top', options: MARGIN_OPTIONS },
    marginBottom: { type: 'select' as const, label: 'Margin Bottom', options: MARGIN_OPTIONS },
    // ── Overflow & Position ──────────────────────────────────────────────────
    overflow: {
      type: 'select' as const,
      label: 'Overflow',
      options: [
        { value: '', label: 'Default' },
        { value: 'hidden', label: 'Hidden' },
        { value: 'auto', label: 'Auto (scroll)' },
        { value: 'visible', label: 'Visible' },
      ],
    },
    position: {
      type: 'select' as const,
      label: 'Position',
      options: [
        { value: '', label: 'Default' },
        { value: 'relative', label: 'Relative' },
        { value: 'sticky', label: 'Sticky' },
      ],
    },
    zIndex: {
      type: 'select' as const,
      label: 'Z-Index',
      options: [
        { value: '', label: 'Default' },
        { value: '0', label: '0' },
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
      ],
    },
    // ── Visibility ──────────────────────────────────────────────────────────
    hideOnMobile: {
      type: 'radio' as const,
      label: 'Hide on Mobile',
      options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }],
    },
    hideOnTablet: {
      type: 'radio' as const,
      label: 'Hide on Tablet',
      options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }],
    },
    hideOnDesktop: {
      type: 'radio' as const,
      label: 'Hide on Desktop',
      options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }],
    },
    // ── Animation ───────────────────────────────────────────────────────────
    animation: {
      type: 'select' as const,
      label: 'Scroll Animation',
      options: [
        { value: 'none', label: 'None' }, { value: 'fadeIn', label: 'Fade In' },
        { value: 'slideUp', label: 'Slide Up' }, { value: 'slideLeft', label: 'Slide Left' },
        { value: 'zoom', label: 'Zoom In' },
      ],
    },
    animationDelay: {
      type: 'select' as const,
      label: 'Animation Delay',
      options: [
        { value: '0', label: 'None' }, { value: '0.1', label: '100ms' }, { value: '0.2', label: '200ms' },
        { value: '0.4', label: '400ms' }, { value: '0.6', label: '600ms' }, { value: '1', label: '1s' },
      ],
    },
  } as const
}

export function allStyleDefaults() {
  return {
    bgColor: '',
    bgGradientFrom: '',
    bgGradientTo: '',
    bgGradientDir: '180deg',
    bgImage: '',
    bgImagePosition: 'center',
    bgImageOverlayColor: '#000000',
    bgImageOverlayOpacity: '0',
    textColor: '',
    textAlign: '',
    fontSize: '',
    fontWeight: '',
    letterSpacing: '',
    lineHeight: '',
    paddingTop: '4rem',
    paddingBottom: '4rem',
    paddingX: '',
    contentMaxWidth: '',
    borderRadius: '',
    borderWidth: 'none',
    borderColor: '',
    boxShadow: 'none',
    width: '',
    height: '',
    minHeight: '',
    maxHeight: '',
    marginTop: '',
    marginBottom: '',
    overflow: '',
    position: '',
    zIndex: '',
    hideOnMobile: 'false',
    hideOnTablet: 'false',
    hideOnDesktop: 'false',
    animation: 'none',
    animationDelay: '0',
  }
}

export type AllStyleDefaults = ReturnType<typeof allStyleDefaults>

// ── applyBlockStyles ─────────────────────────────────────────────────────────
// Converts all AllStyleDefaults props into a CSSProperties object.
// Pass this as the `style` of the block's root <section>/<div>.

const SHADOW_MAP: Record<string, string> = {
  sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  md: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)',
  glow: '0 0 24px rgba(232,213,176,0.35)',
  none: 'none',
}

export function applyBlockStyles(s: Partial<AllStyleDefaults>): React.CSSProperties {
  const bg = s.bgGradientFrom && s.bgGradientTo
    ? `linear-gradient(${s.bgGradientDir || '180deg'}, ${s.bgGradientFrom}, ${s.bgGradientTo})`
    : s.bgColor || undefined

  const bgImage = s.bgImage
    ? s.bgGradientFrom
      ? `linear-gradient(${s.bgGradientDir || '180deg'}, ${s.bgGradientFrom}CC, ${s.bgGradientTo || s.bgGradientFrom}CC), url(${s.bgImage})`
      : s.bgImageOverlayColor && s.bgImageOverlayOpacity && s.bgImageOverlayOpacity !== '0'
        ? `linear-gradient(rgba(${hexToRgb(s.bgImageOverlayColor)},${s.bgImageOverlayOpacity}), rgba(${hexToRgb(s.bgImageOverlayColor)},${s.bgImageOverlayOpacity})), url(${s.bgImage})`
        : `url(${s.bgImage})`
    : undefined

  return {
    ...(bgImage
      ? { backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: s.bgImagePosition || 'center' }
      : bg ? { background: bg } : {}),
    color: s.textColor || undefined,
    textAlign: (s.textAlign as React.CSSProperties['textAlign']) || undefined,
    fontSize: s.fontSize || undefined,
    fontWeight: s.fontWeight ? Number(s.fontWeight) as React.CSSProperties['fontWeight'] : undefined,
    letterSpacing: s.letterSpacing || undefined,
    lineHeight: s.lineHeight || undefined,
    paddingTop: s.paddingTop || undefined,
    paddingBottom: s.paddingBottom || undefined,
    paddingLeft: s.paddingX || undefined,
    paddingRight: s.paddingX || undefined,
    borderRadius: s.borderRadius || undefined,
    border: s.borderWidth && s.borderWidth !== 'none'
      ? `${s.borderWidth} solid ${s.borderColor || 'currentColor'}`
      : undefined,
    boxShadow: s.boxShadow && s.boxShadow !== 'none' ? SHADOW_MAP[s.boxShadow] || s.boxShadow : undefined,
    width: s.width || undefined,
    height: s.height || undefined,
    minHeight: s.minHeight || undefined,
    maxHeight: s.maxHeight || undefined,
    marginTop: s.marginTop || undefined,
    marginBottom: s.marginBottom || undefined,
    overflow: (s.overflow as React.CSSProperties['overflow']) || undefined,
    position: (s.position as React.CSSProperties['position']) || undefined,
    zIndex: s.zIndex ? Number(s.zIndex) : undefined,
  }
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)].join(',')
  }
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)].join(',')
}
