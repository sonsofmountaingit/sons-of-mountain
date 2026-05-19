'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'

export function DiscountCodeInput() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { subtotal, setDiscount, appliedDiscount, corporatePeopleCount } = useCartStore()

  async function apply() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal(), peopleCount: corporatePeopleCount }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid code'); return }
      setDiscount({ code: data.code, type: data.type, value: data.value, discountAmount: data.discountAmount, applicableTo: 'all' })
    } catch {
      setError('Failed to validate code')
    } finally {
      setLoading(false)
    }
  }

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2 text-sm">
        <span className="text-green-800 font-medium">Code <strong>{appliedDiscount.code}</strong> applied — −€{appliedDiscount.discountAmount.toFixed(2)}</span>
        <button onClick={() => setDiscount(null)} className="text-green-600 hover:text-green-900 text-xs underline ml-2">Remove</button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Discount code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button
          onClick={apply}
          disabled={loading || !code}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
