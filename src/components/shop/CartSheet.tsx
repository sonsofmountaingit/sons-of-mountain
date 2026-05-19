'use client'

import { useCartStore } from '@/lib/cart-store'
import { CartItemRow } from './CartItem'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface CartSheetProps {
  open: boolean
  onClose: () => void
}

export function CartSheet({ open, onClose }: CartSheetProps) {
  const { items, subtotal, total, itemCount, clear } = useCartStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden />
      )}
      <div
        ref={ref}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Cart ({itemCount()})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900" aria-label="Close cart">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 divide-y">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => <CartItemRow key={`${item.id}-${item.variantId}`} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>€{subtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>€{total().toFixed(2)}</span>
            </div>
            <Link
              href="/shop/checkout"
              onClick={onClose}
              className="block w-full rounded bg-gray-900 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              Checkout
            </Link>
            <button
              onClick={clear}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-700 underline"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
