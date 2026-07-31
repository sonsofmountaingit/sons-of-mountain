'use client'

import { useCartStore, type CartItem } from '@/lib/cart-store'
import { useTranslations } from '@/lib/use-translations'
import { gtagEvent } from '@/lib/gtag'

interface AddToCartButtonProps {
  item: CartItem
  className?: string
  children?: React.ReactNode
}

export function AddToCartButton({ item, className = '', children }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const preferredCurrency = useCartStore((s) => s.preferredCurrency)
  const { t } = useTranslations()

  return (
    <button
      onClick={() => {
        addItem(item)
        gtagEvent('add_to_cart', {
          currency: preferredCurrency,
          value: item.unitPrice * item.quantity,
          items: [{ item_id: item.id, item_name: item.title, price: item.unitPrice, item_category: item.type, quantity: item.quantity }],
        })
      }}
      className={`rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors ${className}`}
    >
      {children ?? t.shop.add_to_cart}
    </button>
  )
}
