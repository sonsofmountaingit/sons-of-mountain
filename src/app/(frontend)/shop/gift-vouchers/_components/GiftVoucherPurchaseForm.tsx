'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().min(10, 'Minimum €10').max(5000),
  recipientName: z.string().min(1, 'Required'),
  recipientEmail: z.string().email('Invalid email'),
  senderName: z.string().min(1, 'Required'),
  senderEmail: z.string().email('Invalid email'),
  message: z.string().optional(),
  deliveryDate: z.string().optional(),
  voucherType: z.enum(['open', 'destination', 'trip', 'program']),
  destinationId: z.string().optional(),
  tripId: z.string().optional(),
  programId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  destinations: any[]
  trips: any[]
  programs: any[]
}

export function GiftVoucherPurchaseForm({ destinations, trips, programs }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { voucherType: 'open', amount: 100 },
  })

  const voucherType = watch('voucherType')

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'voucher',
          amount: data.amount,
          currency: 'eur',
          description: `Gift Voucher for ${data.recipientName}`,
          customerEmail: data.senderEmail,
          successPath: '/shop/gift-vouchers/success',
          cancelPath: '/shop/gift-vouchers',
          // Pass gift voucher data as metadata for webhook processing
          giftVoucherData: {
            recipientName: data.recipientName,
            recipientEmail: data.recipientEmail,
            senderName: data.senderName,
            senderEmail: data.senderEmail,
            message: data.message,
            deliveryDate: data.deliveryDate,
            forDestination: data.destinationId,
            forTrip: data.tripId,
            forProgram: data.programId,
          },
        }),
      })
      const result = await res.json()
      if (result.url) window.location.href = result.url
    } catch {
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Voucher type</label>
        <select {...register('voucherType')} className="w-full rounded border px-3 py-2 text-sm">
          <option value="open">Open value (any booking)</option>
          <option value="destination">Specific destination</option>
          <option value="trip">Specific trip</option>
          <option value="program">Specific program</option>
        </select>
      </div>

      {voucherType === 'destination' && (
        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <select {...register('destinationId')} className="w-full rounded border px-3 py-2 text-sm">
            <option value="">Select destination</option>
            {destinations.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      )}
      {voucherType === 'trip' && (
        <div>
          <label className="block text-sm font-medium mb-1">Trip</label>
          <select {...register('tripId')} className="w-full rounded border px-3 py-2 text-sm">
            <option value="">Select trip</option>
            {trips.map((t: any) => <option key={t.id} value={t.id}>{t.title ?? t.id}</option>)}
          </select>
        </div>
      )}
      {voucherType === 'program' && (
        <div>
          <label className="block text-sm font-medium mb-1">Program</label>
          <select {...register('programId')} className="w-full rounded border px-3 py-2 text-sm">
            <option value="">Select program</option>
            {programs.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Amount (EUR)</label>
        <input {...register('amount', { valueAsNumber: true })} type="number" min={10} max={5000} className="w-full rounded border px-3 py-2 text-sm" />
        {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient name</label>
          <input {...register('recipientName')} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.recipientName && <p className="text-xs text-red-600 mt-1">{errors.recipientName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recipient email</label>
          <input {...register('recipientEmail')} type="email" className="w-full rounded border px-3 py-2 text-sm" />
          {errors.recipientEmail && <p className="text-xs text-red-600 mt-1">{errors.recipientEmail.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Your name</label>
          <input {...register('senderName')} className="w-full rounded border px-3 py-2 text-sm" />
          {errors.senderName && <p className="text-xs text-red-600 mt-1">{errors.senderName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Your email</label>
          <input {...register('senderEmail')} type="email" className="w-full rounded border px-3 py-2 text-sm" />
          {errors.senderEmail && <p className="text-xs text-red-600 mt-1">{errors.senderEmail.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Personal message (optional)</label>
        <textarea {...register('message')} rows={3} className="w-full rounded border px-3 py-2 text-sm" placeholder="Happy birthday! Enjoy your next adventure..." />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deliver on (optional)</label>
        <input {...register('deliveryDate')} type="date" className="w-full rounded border px-3 py-2 text-sm" />
        <p className="text-xs text-gray-400 mt-1">Leave empty to send immediately after payment</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Redirecting...' : 'Purchase gift voucher'}
      </button>
    </form>
  )
}
