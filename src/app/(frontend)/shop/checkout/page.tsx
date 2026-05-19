'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { CartItemRow } from '@/components/shop/CartItem'
import { DiscountCodeInput } from '@/components/shop/DiscountCodeInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const infoSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(6, 'Required'),
  paymentMode: z.enum(['full', 'deposit', 'installments']),
})

type InfoForm = z.infer<typeof infoSchema>

const steps = ['Info', 'Review', 'Payment']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const { items, subtotal, discountAmount, voucherAmount, total, loyaltyPointsToRedeem, appliedDiscount, appliedVoucher, corporatePeopleCount } = useCartStore()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<InfoForm>({
    resolver: zodResolver(infoSchema),
    defaultValues: { paymentMode: 'full' },
  })

  async function goToPayment() {
    setLoading(true)
    try {
      const info = getValues()
      const hasPhysical = items.some((i) => i.type === 'product')
      const hasTrip = items.some((i) => i.type === 'trip' || i.type === 'program')
      const depositAmount = hasTrip ? items.find((i) => i.type === 'trip' || i.type === 'program') as any : null

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cart',
          items,
          currency: 'eur',
          orderTotal: total(),
          customerEmail: info.email,
          firstName: info.firstName,
          lastName: info.lastName,
          phone: info.phone,
          paymentMode: info.paymentMode,
          discountCodeId: appliedDiscount ? undefined : undefined,
          loyaltyPointsRedeemed: loyaltyPointsToRedeem,
          corporatePeopleCount,
          enableBnpl: true,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href="/shop" className="rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white">Browse shop</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Steps */}
      <nav className="mb-10 flex gap-2" aria-label="Checkout steps">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${i <= step ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
            <span className={`text-sm ${i === step ? 'font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-gray-200" />}
          </div>
        ))}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Step 0: Info */}
          {step === 0 && (
            <form onSubmit={handleSubmit(() => setStep(1))} className="space-y-4">
              <h2 className="text-xl font-semibold">Contact information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">First name</label>
                  <input {...register('firstName')} className="w-full rounded border px-3 py-2 text-sm" />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last name</label>
                  <input {...register('lastName')} className="w-full rounded border px-3 py-2 text-sm" />
                  {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full rounded border px-3 py-2 text-sm" />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input {...register('phone')} type="tel" className="w-full rounded border px-3 py-2 text-sm" />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
              </div>

              {items.some((i) => i.type === 'trip' || i.type === 'program') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Payment option</label>
                  <div className="space-y-2">
                    {['full', 'deposit', 'installments'].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input {...register('paymentMode')} type="radio" value={mode} className="text-gray-900" />
                        <span className="text-sm">
                          {mode === 'full' && 'Pay in full'}
                          {mode === 'deposit' && 'Pay deposit now'}
                          {mode === 'installments' && 'Pay in installments (Klarna / Afterpay)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="w-full rounded bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700">
                Continue to review
              </button>
            </form>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Order review</h2>
              <div className="divide-y border rounded-lg">
                {items.map((item) => <CartItemRow key={`${item.id}-${item.variantId}`} item={item} />)}
              </div>
              <DiscountCodeInput />
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="rounded border px-6 py-3 text-sm font-medium hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(2)} className="flex-1 rounded bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700">Continue to payment</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment</h2>
              <p className="text-sm text-gray-500">You will be redirected to Stripe for secure payment. Supports Klarna, Afterpay, and card.</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded border px-6 py-3 text-sm font-medium hover:bg-gray-50">Back</button>
                <button
                  onClick={goToPayment}
                  disabled={loading}
                  className="flex-1 rounded bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Redirecting...' : `Pay €${total().toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-lg border bg-gray-50 p-6 h-fit space-y-3 text-sm">
          <h3 className="font-semibold text-base">Order summary</h3>
          <div className="flex justify-between"><span>Subtotal</span><span>€{subtotal().toFixed(2)}</span></div>
          {discountAmount() > 0 && <div className="flex justify-between text-green-700"><span>Discount ({appliedDiscount?.code})</span><span>−€{discountAmount().toFixed(2)}</span></div>}
          {voucherAmount() > 0 && <div className="flex justify-between text-green-700"><span>Gift voucher</span><span>−€{voucherAmount().toFixed(2)}</span></div>}
          {loyaltyPointsToRedeem > 0 && <div className="flex justify-between text-green-700"><span>Loyalty points ({loyaltyPointsToRedeem} pts)</span><span>−€{(loyaltyPointsToRedeem / 100).toFixed(2)}</span></div>}
          <div className="border-t pt-3 flex justify-between font-bold text-base"><span>Total</span><span>€{total().toFixed(2)}</span></div>
        </div>
      </div>
    </main>
  )
}
