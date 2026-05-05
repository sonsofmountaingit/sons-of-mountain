'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().min(50, 'Минимум 50 лв.').max(10000),
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  recipientName: z.string().min(2),
  message: z.string().optional(),
  preferredDestinations: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function GiftVoucherForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
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
        <p className="font-semibold mb-2">Заявката е получена!</p>
        <p className="text-sm text-white/50 mb-2">Ще ти изпратим ваучера по имейл след потвърждение на плащането.</p>
        <p className="text-xs text-white/30">За момента приемаме плащания само по банков път.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="text-xs text-white/50 mb-1.5 block">Стойност на ваучера (лв.)</label>
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
          <input {...register('buyerName')} placeholder="Твоето име" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
          {errors.buyerName && <p className="text-xs text-red-400 mt-1">{errors.buyerName.message}</p>}
        </div>
        <div>
          <input {...register('buyerEmail')} type="email" placeholder="Твоят имейл" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
          {errors.buyerEmail && <p className="text-xs text-red-400 mt-1">{errors.buyerEmail.message}</p>}
        </div>
      </div>
      <div>
        <input {...register('recipientName')} placeholder="Имe на получателя" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
        {errors.recipientName && <p className="text-xs text-red-400 mt-1">{errors.recipientName.message}</p>}
      </div>
      <div>
        <input {...register('preferredDestinations')} placeholder="Предпочитани дестинации (по желание)" className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
      </div>
      <div>
        <textarea {...register('message')} placeholder="Лично съобщение (по желание)" rows={4} className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none" />
      </div>
      <div className="border border-white/10 rounded-lg p-4 text-xs text-white/40">
        За момента приемаме плащания само по банков път. След изпращане на заявката ще получиш имейл с банкова информация.
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Изпращане...' : 'Поръчай ваучер'}
      </button>
      {status === 'error' && <p className="text-xs text-red-400 text-center">Грешка. Опитайте отново.</p>}
    </form>
  )
}
