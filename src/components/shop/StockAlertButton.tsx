'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/use-translations'

interface StockAlertButtonProps {
  itemType: 'trip' | 'product' | 'program' | 'destination'
  itemId: string
}

export function StockAlertButton({ itemType, itemId }: StockAlertButtonProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslations()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/stock-alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, itemType, itemId }),
      })
      setSubmitted(true)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return <p className="text-sm text-green-600">{t.shop.stock_alert_confirmation}</p>
  }

  return (
    <div>
      {open ? (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder={t.shop.stock_alert_email_placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {t.shop.stock_alert_notify_me}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
        >
          {t.shop.stock_alert_cta}
        </button>
      )}
    </div>
  )
}
