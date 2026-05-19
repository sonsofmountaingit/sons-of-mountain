'use client'

import { useCartStore, type CartItem } from '@/lib/cart-store'

interface AddToCartButtonProps {
  item: CartItem
  className?: string
  children?: React.ReactNode
}

export function AddToCartButton({ item, className = '', children }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <button
      onClick={() => addItem(item)}
      className={`rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors ${className}`}
    >
      {children ?? 'Add to cart'}
    </button>
  )
}
