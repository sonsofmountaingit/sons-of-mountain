'use client'

import { useState } from 'react'

type FormField = {
  label: string
  fieldKey: string
  fieldType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox'
  required?: boolean
  helpText?: string
  options?: { label: string }[]
}

type Props = {
  token: string
  formId: string
  fields: FormField[]
}

export function RegistrationForm({ token, formId, fields }: Props) {
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function setValue(key: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`/api/registration-form/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, data: values }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Формулярът е изпратен успешно. Благодарим ти!</p>
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 560 }}>
      {fields.map((field) => (
        <div key={field.fieldKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontWeight: 600 }}>
            {field.label}
            {field.required && ' *'}
          </label>
          {field.helpText && <span style={{ fontSize: '0.8rem', color: '#7a7a7a' }}>{field.helpText}</span>}

          {field.fieldType === 'textarea' && (
            <textarea
              required={field.required}
              rows={4}
              onChange={(e) => setValue(field.fieldKey, e.target.value)}
              style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
            />
          )}

          {field.fieldType === 'select' && (
            <select
              required={field.required}
              defaultValue=""
              onChange={(e) => setValue(field.fieldKey, e.target.value)}
              style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
            >
              <option value="" disabled>Избери...</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          )}

          {field.fieldType === 'checkbox' && (
            <input
              type="checkbox"
              onChange={(e) => setValue(field.fieldKey, e.target.checked)}
              style={{ width: '1.25rem', height: '1.25rem' }}
            />
          )}

          {(field.fieldType === 'text' || field.fieldType === 'number' || field.fieldType === 'date') && (
            <input
              type={field.fieldType}
              required={field.required}
              onChange={(e) => setValue(field.fieldKey, e.target.value)}
              style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ padding: '0.75rem 1.5rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
      >
        {status === 'loading' ? 'Изпращане...' : 'Изпрати'}
      </button>

      {status === 'error' && <p style={{ color: '#c0392b' }}>Възникна грешка. Опитай отново.</p>}
    </form>
  )
}
