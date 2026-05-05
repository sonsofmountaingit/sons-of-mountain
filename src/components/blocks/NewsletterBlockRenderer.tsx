'use client'

import { useState } from 'react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface NewsletterBlockProps {
  block: {
    heading?: string | null
    subheading?: string | null
    placeholder?: string | null
    buttonText?: string | null
    formAction?: string | null
    successMessage?: string | null
  } & BlockStyleProps
}

export function NewsletterBlockRenderer({ block }: NewsletterBlockProps) {
  const { heading, subheading, placeholder, buttonText, formAction, successMessage, ...styleProps } = block
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      if (formAction) {
        await fetch(formAction, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
      }
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-xl mx-auto px-6 text-center">
      {heading && <h2 className="text-3xl font-bold mb-3">{heading}</h2>}
      {subheading && <p className="opacity-60 mb-8 leading-relaxed">{subheading}</p>}
      {sent ? (
        <p className="text-green-400 font-semibold">{successMessage || '✓ You\'re on the list!'}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder || 'Your email address'}
            required
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:opacity-40 focus:outline-none focus:border-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '…' : (buttonText || 'Subscribe')}
          </button>
        </form>
      )}
    </BlockWrapper>
  )
}
