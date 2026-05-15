'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface Voucher {
  id: string
  code: string
  amount: number
  currency: string
  status: string
  recipientEmail?: string
  recipientName?: string
  expiresAt?: string
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: 'Активен', color: 'text-green-400' },
  redeemed: { label: 'Използван', color: 'text-white/30' },
  expired: { label: 'Изтекъл', color: 'text-white/30' },
  cancelled: { label: 'Отказан', color: 'text-red-400' },
}

export function VouchersClient({ vouchers }: { vouchers: Voucher[] }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemMsg, setRedeemMsg] = useState('')
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.voucher-row', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' })
    }, listRef)
    return () => ctx.revert()
  }, [])

  async function redeemVoucher(e: React.FormEvent) {
    e.preventDefault()
    setRedeeming(true)
    setRedeemMsg('')
    const res = await fetch(`/api/voucher?code=${encodeURIComponent(redeemCode)}`)
    const data = await res.json()
    setRedeeming(false)
    setRedeemMsg(res.ok ? `Ваучерът е използван! Стойност: ${data.voucher?.amount} ${data.voucher?.currency}` : (data.error ?? 'Грешка'))
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 max-w-3xl mx-auto">
      <a href="/dashboard" className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest">← НАЗАД</a>
      <h1 className="text-2xl font-light tracking-widest mt-6 mb-10 uppercase">Ваучери</h1>

      <div className="mb-8 border border-white/10 rounded-sm p-5">
        <p className="text-xs tracking-widest text-white/40 uppercase mb-4">Използвай ваучер</p>
        <form onSubmit={redeemVoucher} className="flex gap-3">
          <input
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            placeholder="SOM-XXXX-XXXX"
            className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
          />
          <button
            type="submit"
            disabled={redeeming || !redeemCode}
            className="px-5 py-2.5 text-xs tracking-widest border border-white/30 text-white/70 hover:text-white hover:border-white transition-colors rounded-sm disabled:opacity-40"
          >
            {redeeming ? '…' : 'ИЗПОЛЗВАЙ'}
          </button>
        </form>
        {redeemMsg && <p className="text-xs text-white/50 mt-3">{redeemMsg}</p>}
      </div>

      {vouchers.length === 0 ? (
        <p className="text-sm text-white/30">Нямаш ваучери все още.</p>
      ) : (
        <div ref={listRef} className="flex flex-col gap-3">
          {vouchers.map((v) => {
            const { label, color } = STATUS_MAP[v.status] ?? { label: v.status, color: 'text-white/40' }
            return (
              <div key={v.id} className="voucher-row border border-white/10 rounded-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-mono text-white/80">{v.code}</p>
                    {v.recipientName && <p className="text-xs text-white/40 mt-1">За: {v.recipientName} ({v.recipientEmail})</p>}
                    {v.expiresAt && <p className="text-xs text-white/30 mt-0.5">Изтича: {new Date(v.expiresAt).toLocaleDateString('bg-BG')}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-xs tracking-widest ${color}`}>{label}</p>
                    <p className="text-sm text-white/60 mt-1">{v.amount} {v.currency}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
