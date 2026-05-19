'use client'

import { useState, useEffect } from 'react'

interface WishlistButtonProps {
  itemType: 'trip' | 'program' | 'destination' | 'product'
  itemId: string
  className?: string
}

export function WishlistButton({ itemType, itemId, className = '' }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const key = `wishlist-${itemType}-${itemId}`

  useEffect(() => {
    setSaved(localStorage.getItem(key) === '1')
  }, [key])

  async function toggle() {
    setLoading(true)
    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemId }),
      })
      if (res.ok) {
        const next = !saved
        setSaved(next)
        if (next) localStorage.setItem(key, '1')
        else localStorage.removeItem(key)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 ${className}`}
    >
      <svg
        className={`h-5 w-5 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}`}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  )
}
