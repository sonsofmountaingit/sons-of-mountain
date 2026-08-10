'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/currency'
import { useTranslations } from '@/lib/use-translations'

export function VoucherCodeInput() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setVoucher, setDiscount, appliedVoucher, appliedDiscount, subtotal, corporatePeopleCount, items } = useCartStore()
  const { t } = useTranslations()

  async function apply() {
    setError('')
    setLoading(true)
    try {
      const discountRes = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cartTotal: subtotal(),
          peopleCount: corporatePeopleCount,
          cartItems: items.map((i) => ({ type: i.type, tripId: i.tripId, programId: i.programId, destinationId: i.destinationId })),
        }),
      })
      const discountData = await discountRes.json()
      if (discountRes.ok && discountData.valid) {
        setDiscount({
          id: discountData.id,
          code: discountData.code,
          type: discountData.type,
          value: discountData.value,
          discountAmount: discountData.discountAmount,
          applicableTo: 'all',
        })
        return
      }

      const voucherRes = await fetch('/api/voucher/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const voucherData = await voucherRes.json()
      if (!voucherRes.ok) { setError(voucherData.error ?? discountData.error ?? t.shop.discount_invalid); return }

      const matchesRestrictedOffering = items.some((item) =>
        (voucherData.forDestination && item.destinationId === String(voucherData.forDestination)) ||
        (voucherData.forTrip && item.tripId === String(voucherData.forTrip)) ||
        (voucherData.forProgram && item.programId === String(voucherData.forProgram)),
      )
      const isRestricted = voucherData.forDestination || voucherData.forTrip || voucherData.forProgram
      if (isRestricted && !matchesRestrictedOffering) {
        setError('This voucher is valid only for its selected destination, trip, or program.')
        return
      }

      setVoucher({
        id: voucherData.id,
        code: voucherData.code,
        amount: voucherData.amount,
        currency: voucherData.currency,
        forDestination: voucherData.forDestination,
        forTrip: voucherData.forTrip,
        forProgram: voucherData.forProgram,
      })
    } catch {
      setError(t.shop.discount_failed)
    } finally {
      setLoading(false)
    }
  }

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2 text-sm">
        <span className="text-green-800 font-medium">{t.shop.discount_applied_prefix} <strong>{appliedDiscount.code}</strong> {t.shop.discount_applied_suffix}</span>
        <button onClick={() => setDiscount(null)} className="text-green-600 hover:text-green-900 text-xs underline ml-2">{t.shop.discount_remove}</button>
      </div>
    )
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
