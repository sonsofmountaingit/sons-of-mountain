'use client'

import { useState } from 'react'

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
    return <p className="text-sm text-green-600">You are #{position} on the waitlist. We will contact you when a spot opens.</p>
  }

  return (
    <div>
      {open ? (
        <form onSubmit={submit} className="space-y-2">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Join waitlist
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          Join waitlist
        </button>
      )}
    </div>
  )
}
