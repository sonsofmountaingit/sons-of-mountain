'use client'

import Image from 'next/image'
import { useCartStore, type CartItem } from '@/lib/cart-store'

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore()

  return (
    <div className="flex gap-3 py-4">
      {item.image && (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium">{item.title}</p>
        {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded border text-sm hover:bg-gray-100"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded border text-sm hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <p className="text-sm font-semibold">€{(item.unitPrice * item.quantity).toFixed(2)}</p>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-700"
        aria-label="Remove item"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
