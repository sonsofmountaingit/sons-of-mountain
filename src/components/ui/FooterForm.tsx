'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FooterFormProps {
  privacyUrl?: string
  submitLabel?: string
  firstNamePlaceholder?: string
  lastNamePlaceholder?: string
  emailPlaceholder?: string
  consentText?: string
  consentLinkText?: string
}

export function FooterForm({
  privacyUrl = '/legal/cookies',
  submitLabel = 'Абонирай се',
  firstNamePlaceholder = 'Име',
  lastNamePlaceholder = 'Фамилия',
  emailPlaceholder = 'E-mail адрес',
  consentText = 'С натискането на бутона "Абонирай се" се съгласяваш с',
  consentLinkText = 'Политиката ни за поверителност',
}: FooterFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: `${firstName} ${lastName}`.trim() }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#111111',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.5rem',
    padding: '0.65rem 0.875rem',
    fontSize: '0.875rem',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
  }

  if (status === 'success') {
    return (
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '1rem 0' }}>
        Успешно се абонирахте!
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <input
        type="text"
        placeholder={firstNamePlaceholder}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder={lastNamePlaceholder}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder={emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          width: '100%',
          backgroundColor: '#b85c1a',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: status === 'loading' ? 'wait' : 'pointer',
          marginTop: '0.125rem',
        }}
      >
        {status === 'loading' ? '…' : submitLabel}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: '0.75rem', color: '#f87171', margin: 0, textAlign: 'center' }}>
          Грешка. Опитайте отново.
        </p>
      )}
      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', textAlign: 'center', margin: '0.25rem 0 0 0' }}>
        {consentText}{' '}
        <Link href={privacyUrl} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
          {consentLinkText}
        </Link>
      </p>
    </form>
  )
}
