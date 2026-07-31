'use client'

import { useEffect } from 'react'
import { gtagEvent } from '@/lib/gtag'

interface Props {
  id: string
  name: string
  price: number
  category: 'trip' | 'program' | 'destination' | 'product' | 'bundle' | 'gift-voucher'
  currency?: string
}

export function ViewItemTracker({ id, name, price, category, currency = 'EUR' }: Props) {
  useEffect(() => {
    gtagEvent('view_item', {
      currency,
      value: price,
      items: [{ item_id: id, item_name: name, price, item_category: category, quantity: 1 }],
    })
  }, [id, name, price, category, currency])

  return null
}
