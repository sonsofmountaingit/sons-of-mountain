'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Order {
  id: string
  status: string
  totalAmount: number
  currency: string
  createdAt: string
  productType?: string
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
    <div className="min-h-screen bg-black text-white px-4 py-16 max-w-3xl mx-auto">
      <a href="/dashboard" className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest">← НАЗАД</a>
      <h1 className="text-2xl font-light tracking-widest mt-6 mb-10 uppercase">Поръчки</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-white/30">Нямаш поръчки все още.</p>
      ) : (
        <div ref={listRef} className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="order-row border border-white/10 rounded-sm p-5 flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">{o.productType ?? 'Поръчка'}</p>
                <p className="text-xs text-white/30 mt-1">{new Date(o.createdAt).toLocaleDateString('bg-BG')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-widest text-white/50">{o.status}</p>
                <p className="text-sm text-white/60 mt-1">{o.totalAmount} {o.currency}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
