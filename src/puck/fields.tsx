'use client'

import type { CustomField } from '@puckeditor/core'

// Color picker: native color wheel + hex text input
export const colorField = (label: string): CustomField<string> => ({
  type: 'custom',
  label,
  render: ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <input
        type="color"
        value={value && /^#[0-9a-fA-F]{3,6}$/.test(value) ? value : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 32, height: 32, padding: 2, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, cursor: 'pointer', flexShrink: 0 }}
      />
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="CSS color or leave empty"
        style={{ flex: 1, padding: '4px 8px', fontSize: 13, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4, minWidth: 0 }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          title="Clear"
          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'rgba(0,0,0,0.4)', padding: '0 2px' }}
        >
          ×
        </button>
      )}
    </div>
  ),
})

// Image URL field with live preview
export const imageUrlField = (label: string): CustomField<string> => ({
  type: 'custom',
  label,
  render: ({ value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <input
        type="url"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        style={{ padding: '6px 8px', fontSize: 13, border: '1px solid rgba(0,0,0,0.15)', borderRadius: 4 }}
      />
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(0,0,0,0.1)' }}
        />
      )}
    </div>
  ),
})

// Link field: text + URL combined
export const linkField = (textLabel: string, urlLabel: string) => ({
  textLabel,
  urlLabel,
  textField: { type: 'text' as const, label: textLabel },
  urlField: { type: 'text' as const, label: urlLabel },
})
