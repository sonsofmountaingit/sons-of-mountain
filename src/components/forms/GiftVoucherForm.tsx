'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from '@/lib/use-translations'

function makeSchema(minAmountMessage: string) {
  return z.object({
    amount: z.number().min(50, minAmountMessage).max(10000),
    buyerName: z.string().min(2),
    buyerEmail: z.string().email(),
    recipientName: z.string().min(2),
    message: z.string().optional(),
    preferredDestinations: z.string().optional(),
  })
}

type FormData = z.infer<ReturnType<typeof makeSchema>>

export function GiftVoucherForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { t } = useTranslations()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(makeSchema(t.gift_voucher_form.min_amount)),
    defaultValues: { amount: 200 },
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/gift-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-white/10 rounded-lg p-8 text-center">
        <p className="font-semibold mb-2">{t.gift_voucher_form.submitted_title}</p>
        <p className="text-sm text-white/50 mb-2">{t.gift_voucher_form.submitted_subtext}</p>
        <p className="text-xs text-white/30">{t.gift_voucher_form.submitted_note}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="text-xs text-white/50 mb-1.5 block">{t.gift_voucher_form.amount_label}</label>
        <input
          {...register('amount', { valueAsNumber: true })}
          type="number"
          min={50}
          step={50}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30"
        />
        {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input {...register('buyerName')} placeholder={t.gift_voucher_form.buyer_name_placeholder} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
          {errors.buyerName && <p className="text-xs text-red-400 mt-1">{errors.buyerName.message}</p>}
        </div>
        <div>
          <input {...register('buyerEmail')} type="email" placeholder={t.gift_voucher_form.buyer_email_placeholder} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
          {errors.buyerEmail && <p className="text-xs text-red-400 mt-1">{errors.buyerEmail.message}</p>}
        </div>
      </div>
      <div>
        <input {...register('recipientName')} placeholder={t.gift_voucher_form.recipient_name_placeholder} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
        {errors.recipientName && <p className="text-xs text-red-400 mt-1">{errors.recipientName.message}</p>}
      </div>
      <div>
        <input {...register('preferredDestinations')} placeholder={t.gift_voucher_form.destinations_placeholder} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
      </div>
      <div>
        <textarea {...register('message')} placeholder={t.gift_voucher_form.message_placeholder} rows={4} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none" />
      </div>
      <div className="border border-white/10 rounded-lg p-4 text-xs text-white/40">
        {t.gift_voucher_form.bank_note}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? t.gift_voucher_form.sending : t.gift_voucher_form.submit}
      </button>
      {status === 'error' && <p className="text-xs text-red-400 text-center">{t.gift_voucher_form.error}</p>}
    </form>
  )
}
