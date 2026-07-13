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

interface Registration {
  id: string
  status: string
  totalAmount: number
  currency: string
  createdAt: string
  paidAt?: string
  stripeSessionId?: string
  participantCount?: number
  trip?: { title?: string } | null
  destination?: { title?: string } | null
  paymentMode?: 'full' | 'deposit' | 'installments'
  depositPaid?: number | null
  remainingBalance?: number | null
  remainingDueDate?: string | null
  installments?: Installment[]
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Чакащ', color: 'text-yellow-400' },
  confirmed: { label: 'Потвърден', color: 'text-blue-400' },
  paid: { label: 'Платен', color: 'text-green-400' },
  cancelled: { label: 'Отказан', color: 'text-red-400' },
  refunded: { label: 'Върнат', color: 'text-orange-400' },
}

const paymentModeLabel: Record<string, string> = {
  full: 'Пълно плащане',
  deposit: 'Депозит',
  installments: 'На вноски',
}

function NextPayment({ r }: { r: Registration }) {
  if (r.paymentMode === 'deposit' && r.remainingBalance != null) {
    return (
      <div className="mt-3 rounded-sm border border-white/10 bg-white/5 p-3">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Следващо плащане</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">Остатък</span>
          <span className="text-xs font-semibold text-white">{formatPrice(r.remainingBalance)}</span>
        </div>
        {r.remainingDueDate && (
          <p className="text-[11px] text-white/30 mt-1">Дата: {new Date(r.remainingDueDate).toLocaleDateString('bg-BG')}</p>
        )}
      </div>
    )
  }

  if (r.paymentMode === 'installments' && r.installments?.length) {
    return (
      <div className="mt-3 rounded-sm border border-white/10 bg-white/5 p-3 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Вноски</p>
        {r.installments.map((row, idx) => (
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

export function RegistrationsClient({ registrations }: { registrations: Registration[] }) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current || registrations.length === 0) return
    const rows = listRef.current.querySelectorAll('.reg-row')
    if (!rows.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(rows, { opacity: 0, x: -12 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' })
    }, listRef)
    return () => ctx.revert()
  }, [registrations.length])

  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl pb-24 lg:pb-10">
      <h1 className="text-2xl font-light tracking-widest mb-10 uppercase">Регистрации</h1>

      {registrations.length === 0 ? (
        <p className="text-sm text-white/30">Нямаш регистрации все още.</p>
      ) : (
        <div ref={listRef} className="flex flex-col gap-3">
          {registrations.map((r) => {
            const { label, color } = STATUS_MAP[r.status] ?? { label: r.status, color: 'text-white/40' }
            return (
              <div key={r.id} className="reg-row border border-white/10 rounded-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/80">{r.trip?.title ?? r.destination?.title ?? 'Регистрация'}</p>
                    <p className="text-xs text-white/30 mt-1">{new Date(r.createdAt).toLocaleDateString('bg-BG')}</p>
                    {r.participantCount && <p className="text-xs text-white/30 mt-0.5">{r.participantCount} участника</p>}
                    {r.paymentMode && r.paymentMode !== 'full' && (
                      <p className="text-[11px] text-white/40 mt-1">{paymentModeLabel[r.paymentMode]}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-xs tracking-widest ${color}`}>{label}</p>
                    <p className="text-sm text-white/60 mt-1">{r.totalAmount} {r.currency}</p>
                  </div>
                </div>
                <NextPayment r={r} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
