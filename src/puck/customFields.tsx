import React, { useState } from 'react'

export const customFieldTypes = {
  colorPicker: ({ value, onChange, name }: { value: string; onChange: (val: string) => void; name: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.currentTarget.value)}
        style={{ width: '40px', height: '40px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px' }}
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="#000000"
        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}
      />
    </div>
  ),

  datePicker: ({ value, onChange, name }: { value: string; onChange: (val: string) => void; name: string }) => (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.currentTarget.value)}
      style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', width: '100%' }}
    />
  ),

  timePicker: ({ value, onChange, name }: { value: string; onChange: (val: string) => void; name: string }) => (
    <input
      type="time"
      value={value || ''}
      onChange={(e) => onChange(e.currentTarget.value)}
      style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', width: '100%' }}
    />
  ),

  urlPicker: ({ value, onChange, name }: { value: string; onChange: (val: string) => void; name: string }) => (
    <input
      type="url"
      value={value || ''}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder="https://example.com"
      style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', width: '100%' }}
    />
  ),

  slider: ({ value, onChange, min = 0, max = 100, step = 1 }: { value: number; onChange: (val: number) => void; min?: number; max?: number; step?: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <input
        type="range"
        value={value || min}
        onChange={(e) => onChange(parseFloat(e.currentTarget.value))}
        min={min}
        max={max}
        step={step}
        style={{ flex: 1, cursor: 'pointer' }}
      />
      <span style={{ minWidth: '40px', textAlign: 'right', fontSize: '12px', fontWeight: '600' }}>
        {value || min}
      </span>
    </div>
  ),

  toggle: ({ value, onChange, name }: { value: boolean; onChange: (val: boolean) => void; name: string }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        padding: '6px 16px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        background: value ? '#007bff' : '#e0e0e0',
        color: value ? '#fff' : '#666',
        transition: 'all 0.2s',
      }}
    >
      {value ? 'ON' : 'OFF'}
    </button>
  ),

  tags: ({ value = [], onChange, name }: { value: string[]; onChange: (val: string[]) => void; name: string }) => {
    const [input, setInput] = useState('')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {value.map((tag, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                background: '#e0e0e0',
                borderRadius: '16px',
                fontSize: '12px',
              }}
            >
              {tag}
              <button
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1',
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
              e.preventDefault()
              onChange([...value, input.trim()])
              setInput('')
            }
          }}
          placeholder="Type and press Enter to add"
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
        />
      </div>
    )
  },
}
