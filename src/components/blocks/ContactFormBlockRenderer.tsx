'use client'

import { useState } from 'react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface ContactFormBlockProps {
  block: {
    heading?: string | null
    subheading?: string | null
    showPhone?: string | null
    showSubject?: string | null
    buttonText?: string | null
    formAction?: string | null
    successMessage?: string | null
  } & BlockStyleProps
}

export function ContactFormBlockRenderer({ block }: ContactFormBlockProps) {
  const { heading, subheading, showPhone, showSubject, buttonText, formAction, successMessage, ...styleProps } = block
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', company: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(formAction || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.status === 429) {
        setError('Too many requests. Try again later.')
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:opacity-40 focus:outline-none focus:border-white/50'

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-2xl mx-auto px-6">
      {heading && <h2 className="text-3xl font-bold mb-3 text-center">{heading}</h2>}
      {subheading && <p className="opacity-60 mb-8 text-center leading-relaxed">{subheading}</p>}
      {sent ? (
        <p className="text-green-400 font-semibold text-center py-8">{successMessage || '✓ Message sent! We\'ll be in touch.'}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.company}
            onChange={set('company')}
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Your name" required value={form.name} onChange={set('name')} className={inputClass} />
            <input type="email" placeholder="Email address" required value={form.email} onChange={set('email')} className={inputClass} />
          </div>
          {showPhone === 'true' && (
            <input type="tel" placeholder="Phone number" value={form.phone} onChange={set('phone')} className={inputClass} />
          )}
          {showSubject === 'true' && (
            <input type="text" placeholder="Subject" value={form.subject} onChange={set('subject')} className={inputClass} />
          )}
          <textarea
            placeholder="Your message…"
            required
            rows={5}
            value={form.message}
            onChange={set('message')}
            className={inputClass + ' resize-none'}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending…' : (buttonText || 'Send Message')}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      )}
    </BlockWrapper>
  )
}
