'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/use-translations'

interface WaitlistButtonProps {
  itemType: 'trip' | 'program' | 'destination' | 'product'
  itemId: string
}

export function WaitlistButton({ itemType, itemId }: WaitlistButtonProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslations()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, itemType, itemId }),
      })
      const data = await res.json()
      setPosition(data.position)
      setSubmitted(true)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return <p className="text-sm text-green-600">{t.shop.waitlist_confirmation_prefix}{position} {t.shop.waitlist_confirmation_suffix}</p>
  }

  return (
    <div>
      {open ? (
        <form onSubmit={submit} className="space-y-2">
          <input
            type="text"
            placeholder={t.shop.waitlist_name_placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder={t.shop.waitlist_email_placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {t.shop.waitlist_join}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          {t.shop.waitlist_join}
        </button>
      )}
    </div>
  )
}
