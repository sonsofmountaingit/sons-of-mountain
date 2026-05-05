'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Невалиден имейл'),
  message: z.string().min(10, 'Минимум 10 символа'),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
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
        <p className="font-semibold mb-2">Съобщението е изпратено!</p>
        <p className="text-sm text-white/50">Ще се свържем с теб скоро.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-white/40 hover:text-white underline">
          Изпрати ново
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          placeholder="Твоето име"
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Имейл адрес"
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <textarea
          {...register('message')}
          placeholder="Твоето съобщение"
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
        />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Изпращане...' : 'Изпрати съобщение'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 text-center">Грешка. Опитайте отново.</p>
      )}
    </form>
  )
}
