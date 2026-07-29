'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/currency'
import { useTranslations } from '@/lib/use-translations'

export function VoucherCodeInput() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setVoucher, appliedVoucher } = useCartStore()
  const { t } = useTranslations()

  async function apply() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/voucher/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? t.shop.discount_invalid); return }
      setVoucher({ id: data.id, code: data.code, amount: data.amount, currency: data.currency })
    } catch {
      setError(t.shop.discount_failed)
    } finally {
      setLoading(false)
    }
  }

  if (appliedVoucher) {
    return (
      <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2 text-sm">
        <span className="text-green-800 font-medium">{t.shop.discount_applied_prefix} <strong>{appliedVoucher.code}</strong> {t.shop.discount_applied_suffix} — −{formatPrice(appliedVoucher.amount)}</span>
        <button onClick={() => setVoucher(null)} className="text-green-600 hover:text-green-900 text-xs underline ml-2">{t.shop.discount_remove}</button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t.shop.discount_placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button
          onClick={apply}
          disabled={loading || !code}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {t.shop.discount_apply}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
