'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/currency'

interface Props {
  open: boolean
  onClose: () => void
  tripId: string
  tripTitle: string
  price: number
  currency: string
  spotsAvailable?: number | null
  depositAmount?: number | null
  startDate?: string | null
  endDate?: string | null
  durationDays?: number | null
  month?: string | null
  itemType?: 'trip' | 'program'
  earlyBirdPrice?: number | null
  earlyBirdUntil?: string | null
  earlyBirdSpots?: number | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function BookingDrawer({
  open, onClose, tripId, tripTitle, price, currency,
  spotsAvailable, depositAmount, startDate, endDate,
  durationDays, month, itemType = 'trip',
  earlyBirdPrice, earlyBirdUntil, earlyBirdSpots,
}: Props) {
  const isEarlyBird = !!(earlyBirdPrice && earlyBirdUntil && new Date(earlyBirdUntil) > new Date())
  const effectivePrice = isEarlyBird ? earlyBirdPrice! : price
  const earlyBirdSpotsLeft = isEarlyBird && earlyBirdSpots != null && spotsAvailable != null
    ? Math.min(spotsAvailable, earlyBirdSpots)
    : null
  const addItem = useCartStore(s => s.addItem)
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)
  const [qty, setQty] = useState(1)
  const maxQty = spotsAvailable ?? 99
  const earlyBirdCount = earlyBirdSpotsLeft != null ? Math.min(qty, earlyBirdSpotsLeft) : 0
  const regularCount = qty - earlyBirdCount
  const totalPrice = earlyBirdCount * effectivePrice + regularCount * price

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  function handleBook() {
    const priceBreakdown = earlyBirdCount > 0
      ? {
          earlyBirdCount,
          earlyBirdPrice: earlyBirdPrice!,
          regularCount,
          regularPrice: price,
          totalPrice,
        }
      : undefined

    addItem({
      id: `${itemType}-${tripId}`,
      type: itemType,
      title: isEarlyBird ? `${tripTitle} (Early Bird)` : tripTitle,
      unitPrice: priceBreakdown ? priceBreakdown.totalPrice / qty : effectivePrice,
      quantity: qty,
      priceBreakdown,
      tripId: itemType === 'trip' ? tripId : undefined,
      programId: itemType === 'program' ? tripId : undefined,
      spotsAvailable: spotsAvailable ?? undefined,
      depositAmount: depositAmount ?? undefined,
    })
    router.push('/shop/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Резервация"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[70] bg-white shadow-2xl flex flex-col transition-transform duration-400 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-black/40 mb-1">Резервация</p>
              <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">{tripTitle}</h2>
            </div>
            <button onClick={onClose} aria-label="Затвори" className="mt-1 text-black/40 hover:text-black transition-colors flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {/* Trip summary */}
          <div className="bg-neutral-50 rounded-lg p-4 flex flex-col gap-2 text-sm">
            <p className="font-black text-base text-black uppercase tracking-tight mb-1">{tripTitle}</p>
            {(startDate || month) && (
              <div className="flex items-center gap-2 text-black">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>
                  {startDate && endDate
                    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
                    : startDate ? formatDate(startDate) : month}
                </span>
              </div>
            )}
            {durationDays && (
              <div className="flex items-center gap-2 text-black">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{durationDays} {durationDays === 1 ? 'ден' : 'дни'}</span>
              </div>
            )}
            {spotsAvailable != null && (
              <div className="flex items-center gap-2 text-black">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                <span className={spotsAvailable <= 3 ? 'text-orange-600 font-semibold' : ''}>
                  {spotsAvailable} свободни места
                </span>
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <div className="border border-neutral-100 rounded-lg p-4 flex flex-col gap-3">
            {isEarlyBird && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-md px-3 py-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="text-xs font-semibold text-orange-700">
                  Early Bird цена — до {new Date(earlyBirdUntil!).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
                  {earlyBirdSpotsLeft != null && (
                    <> · <span className="text-orange-600">{earlyBirdSpotsLeft} {earlyBirdSpotsLeft === 1 ? 'място' : 'места'} останали</span></>
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-black">Цена на човек</span>
              <span className="flex items-baseline gap-2">
                <span className="text-xl font-black text-black">{formatPrice(effectivePrice)}</span>
                {isEarlyBird && <span className="text-sm line-through text-black/40">{formatPrice(price)}</span>}
              </span>
            </div>

            {/* Qty picker */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
              <span className="text-sm text-black">Брой хора</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-lg leading-none text-black hover:border-neutral-400 disabled:opacity-30 transition-colors"
                  aria-label="Намали"
                >−</button>
                <span className="w-5 text-center font-semibold text-sm text-black">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-lg leading-none text-black hover:border-neutral-400 disabled:opacity-30 transition-colors"
                  aria-label="Увеличи"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm border-t border-neutral-100 pt-2">
              <span className="text-black">Общо</span>
              <span className="font-black text-black">{formatPrice(totalPrice)}</span>
            </div>

            {earlyBirdCount > 0 && regularCount > 0 && (
              <p className="text-xs text-orange-700">
                {earlyBirdCount} × {formatPrice(earlyBirdPrice!)} early bird + {regularCount} × {formatPrice(price)} редовна цена
              </p>
            )}

            {depositAmount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-black">Депозит за резервация</span>
                <span className="font-semibold text-green-700">{formatPrice(depositAmount * qty)}</span>
              </div>
            )}
            {depositAmount && (
              <p className="text-xs text-black/50">Останалата сума се доплаща преди пътуването.</p>
            )}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-5 border-t border-neutral-100 flex flex-col gap-3">
          <button
            onClick={handleBook}
            className="w-full bg-orange-700 hover:bg-orange-800 text-white font-black uppercase tracking-widest text-sm py-4 rounded-sm transition-colors"
          >
            {depositAmount ? `Резервирай с депозит ${formatPrice(depositAmount)}` : 'Резервирай сега'}
          </button>
          <button
            onClick={onClose}
            className="w-full border border-neutral-200 hover:border-neutral-400 text-black text-sm py-3 rounded-sm transition-colors"
          >
            Продължи разглеждането
          </button>
        </div>
      </div>
    </>
  )
}
