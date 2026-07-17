'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { formatPrice } from '@/lib/currency'

interface Installment {
  label: string
  amount: number
  dueDate: string
  status: 'pending' | 'charged' | 'failed'
}

interface Order {
  id: string
  status: string
  totalAmount: number
  currency: string
  createdAt: string
  productType?: string
  paymentMode?: 'full' | 'deposit' | 'installments'
  depositPaid?: number | null
  remainingBalance?: number | null
  remainingDueDate?: string | null
  installments?: Installment[]
}

const paymentModeLabel: Record<string, string> = {
  full: 'Пълно плащане',
  deposit: 'Депозит',
  installments: 'На вноски',
}

function NextPayment({ o }: { o: Order }) {
  if (o.paymentMode === 'deposit' && o.remainingBalance != null) {
    return (
      <div className="mt-3 rounded-sm border border-white/10 bg-white/5 p-3">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Следващо плащане</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">Остатък</span>
          <span className="text-xs font-semibold text-white">{formatPrice(o.remainingBalance)}</span>
        </div>
        {o.remainingDueDate && (
          <p className="text-[11px] text-white/30 mt-1">Date: {new Date(o.remainingDueDate).toLocaleDateString('bg-BG')}</p>
        )}
      </div>
    )
  }

  if (o.paymentMode === 'installments' && o.installments?.length) {
    return (
      <div className="mt-3 rounded-sm border border-white/10 bg-white/5 p-3 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Вноски</p>
        {o.installments.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-xs text-white/70">
              {row.label} {row.status === 'charged' && <span className="text-green-400">✓</span>}
              {row.status === 'failed' && <span className="text-red-400">✕</span>}
            </span>
            <div className="text-right">
              <span className="text-xs font-semibold text-white">{formatPrice(row.amount)}</span>
              {row.status === 'pending' && (
                <p className="text-[11px] text-white/30">{new Date(row.dueDate).toLocaleDateString('bg-BG')}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export function OrdersClient({ orders }: { orders: Order[] }) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current || orders.length === 0) return
    const rows = listRef.current.querySelectorAll('.order-row')
    if (!rows.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(rows, { opacity: 0, x: -12 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' })
    }, listRef)
    return () => ctx.revert()
  }, [orders.length])

  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl pb-24 lg:pb-10">
      <h1 className="text-2xl font-light tracking-widest mb-10 uppercase">Поръчки</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-white/30">You have no orders yet.</p>
      ) : (
        <div ref={listRef} className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="order-row border border-white/10 rounded-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/80">{o.productType ?? 'Поръчка'}</p>
                  <p className="text-xs text-white/30 mt-1">{new Date(o.createdAt).toLocaleDateString('bg-BG')}</p>
                  {o.paymentMode && o.paymentMode !== 'full' && (
                    <p className="text-[11px] text-white/40 mt-1">{paymentModeLabel[o.paymentMode]}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest text-white/50">{o.status}</p>
                  <p className="text-sm text-white/60 mt-1">{formatPrice(o.totalAmount)} {o.currency !== 'EUR' ? o.currency : ''}</p>
                </div>
              </div>
              <NextPayment o={o} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
