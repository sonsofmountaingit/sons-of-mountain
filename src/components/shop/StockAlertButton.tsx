'use client'

import { useState } from 'react'

interface StockAlertButtonProps {
  itemType: 'trip' | 'product' | 'program' | 'destination'
  itemId: string
}

export function StockAlertButton({ itemType, itemId }: StockAlertButtonProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

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
    return <p className="text-sm text-green-600">We will notify you when this becomes available.</p>
  }

  return (
    <div>
      {open ? (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Notify me
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
        >
          Notify me when available
        </button>
      )}
    </div>
  )
}
