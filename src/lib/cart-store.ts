'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItemType = 'trip' | 'product' | 'program' | 'gift-voucher' | 'bundle'

export interface CartItem {
  id: string
  type: CartItemType
  title: string
  image?: string
  unitPrice: number
  quantity: number
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
  code: string
  type: 'percent' | 'fixed' | 'corporate' | 'referral'
  value: number
  discountAmount: number
  applicableTo: string
}

export interface AppliedVoucher {
  code: string
  amount: number
  currency: string
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
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
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

      subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

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
