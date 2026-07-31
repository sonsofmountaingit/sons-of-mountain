'use client'

import { useEffect } from 'react'
import { gtagEvent, fireOncePerSession, type GtagItem } from '@/lib/gtag'

interface Props {
  transactionId: string
  value: number
  currency: string
  items: GtagItem[]
}

export function PurchaseTracker({ transactionId, value, currency, items }: Props) {
  useEffect(() => {
    fireOncePerSession(`som_purchase_tracked_${transactionId}`, () => {
      gtagEvent('purchase', {
        transaction_id: transactionId,
        currency,
        value,
        items,
      })
    })
  }, [transactionId, value, currency, items])

  return null
}
