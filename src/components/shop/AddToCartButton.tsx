'use client'

import { useCartStore, type CartItem } from '@/lib/cart-store'
import { useTranslations } from '@/lib/use-translations'

interface AddToCartButtonProps {
  item: CartItem
  className?: string
  children?: React.ReactNode
}

export function AddToCartButton({ item, className = '', children }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { t } = useTranslations()

  return (
    <button
      onClick={() => addItem(item)}
      className={`rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors ${className}`}
    >
      {children ?? t.shop.add_to_cart}
    </button>
  )
}
