'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { gtagEvent } from '@/lib/gtag'

export type CartItemType = 'trip' | 'product' | 'program' | 'destination' | 'gift-voucher' | 'bundle'

export interface CartItemPriceBreakdown {
  earlyBirdCount: number
  earlyBirdPrice: number
  regularCount: number
  regularPrice: number
  totalPrice: number
}

export interface CartItem {
  id: string
  type: CartItemType
  title: string
  image?: string
  unitPrice: number
  quantity: number
  priceBreakdown?: CartItemPriceBreakdown
  // Trip/program specific
  tripId?: string
  programId?: string
  destinationId?: string
  startDate?: string
  endDate?: string
  spotsAvailable?: number
  depositAmount?: number
  // Product specific
  productId?: string
  variantId?: string
  variantLabel?: string
  sku?: string
  stock?: number
  // Bundle specific
  bundleId?: string
  // Gift voucher specific
  voucherId?: string
  recipientEmail?: string
}

export interface AppliedDiscount {
  id: string
  code: string
  type: 'percent' | 'fixed' | 'corporate' | 'referral'
  value: number
  discountAmount: number
  applicableTo: string
}

export interface AppliedVoucher {
  id: string
  code: string
  amount: number
  currency: string
  forDestination?: string | null
  forTrip?: string | null
  forProgram?: string | null
}

interface CartState {
  items: CartItem[]
  appliedDiscount: AppliedDiscount | null
  appliedVoucher: AppliedVoucher | null
  corporatePeopleCount: number
  loyaltyPointsToRedeem: number
  preferredCurrency: string

  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  setDiscount: (discount: AppliedDiscount | null) => void
  setVoucher: (voucher: AppliedVoucher | null) => void
  setCorporatePeopleCount: (count: number) => void
  setLoyaltyPointsToRedeem: (points: number) => void
  setPreferredCurrency: (currency: string) => void

  subtotal: () => number
  discountAmount: () => number
  voucherAmount: () => number
  total: () => number
  itemCount: () => number
}

import { useEffect, useState } from 'react'

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedDiscount: null,
      appliedVoucher: null,
      corporatePeopleCount: 1,
      loyaltyPointsToRedeem: 0,
      preferredCurrency: 'EUR',

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.variantId === item.variantId
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        const removed = get().items.find((i) => i.id === id)
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
        if (removed) {
          gtagEvent('remove_from_cart', {
            currency: get().preferredCurrency,
            value: removed.unitPrice * removed.quantity,
            items: [{ item_id: removed.id, item_name: removed.title, price: removed.unitPrice, item_category: removed.type, quantity: removed.quantity }],
          })
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        const existing = get().items.find((i) => i.id === id)
        if (existing && quantity < existing.quantity) {
          const removedQty = existing.quantity - quantity
          gtagEvent('remove_from_cart', {
            currency: get().preferredCurrency,
            value: existing.unitPrice * removedQty,
            items: [{ item_id: existing.id, item_name: existing.title, price: existing.unitPrice, item_category: existing.type, quantity: removedQty }],
          })
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clear: () => set({ items: [], appliedDiscount: null, appliedVoucher: null, loyaltyPointsToRedeem: 0 }),

      setDiscount: (discount) => set({ appliedDiscount: discount }),
      setVoucher: (voucher) => set({ appliedVoucher: voucher }),
      setCorporatePeopleCount: (count) => set({ corporatePeopleCount: count }),
      setLoyaltyPointsToRedeem: (points) => set({ loyaltyPointsToRedeem: points }),
      setPreferredCurrency: (currency) => set({ preferredCurrency: currency }),

      subtotal: () => get().items.reduce((sum, i) => sum + (i.priceBreakdown?.totalPrice ?? i.unitPrice * i.quantity), 0),

      discountAmount: () => {
        const { appliedDiscount, subtotal } = get()
        if (!appliedDiscount) return 0
        if (appliedDiscount.type === 'percent') {
          return Math.round(subtotal() * (appliedDiscount.value / 100) * 100) / 100
        }
        return Math.min(appliedDiscount.value, subtotal())
      },

      voucherAmount: () => {
        const { appliedVoucher, subtotal, discountAmount } = get()
        if (!appliedVoucher) return 0
        const afterDiscount = subtotal() - discountAmount()
        return Math.min(appliedVoucher.amount, afterDiscount)
      },

      total: () => {
        const { subtotal, discountAmount, voucherAmount, loyaltyPointsToRedeem } = get()
        const loyaltyDiscount = loyaltyPointsToRedeem / 100
        return Math.max(0, subtotal() - discountAmount() - voucherAmount() - loyaltyDiscount)
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'som-cart',
      partialize: (state) => ({
        items: state.items,
        appliedDiscount: state.appliedDiscount,
        appliedVoucher: state.appliedVoucher,
        corporatePeopleCount: state.corporatePeopleCount,
        loyaltyPointsToRedeem: state.loyaltyPointsToRedeem,
        preferredCurrency: state.preferredCurrency,
      }),
    }
  )
)
