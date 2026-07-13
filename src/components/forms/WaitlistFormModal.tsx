'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'

const waitlistSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Невалиден имейл'),
  phone: z.string().min(6, 'Невалиден телефон'),
  participantCount: z.number().min(1).max(10),
  message: z.string().optional(),
})

type WaitlistData = z.infer<typeof waitlistSchema>

export type WaitlistItemType = 'trip' | 'program' | 'destination'

interface Props {
  open: boolean
  onClose: () => void
  itemType: WaitlistItemType
  itemId: string
  itemTitle?: string
}

export function WaitlistFormModal({ open, onClose, itemType, itemId, itemTitle }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)

  const form = useForm<WaitlistData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { participantCount: 1 },
  })

  function close() {
    onClose()
    setSubmitted(false)
    setPosition(null)
    form.reset()
  }

  async function onSubmit(data: WaitlistData) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          itemType,
          itemId,
          source: 'sold-out',
        }),
      })
      const json = await res.json().catch(() => null)
      if (res.ok) {
        setPosition(json?.position ?? null)
        setSubmitted(true)
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px] bg-[#111] border border-white/10 rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">Списък с чакащи</p>
                {itemTitle && <p className="text-sm font-medium">{itemTitle}</p>}
              </div>
              <button onClick={close} className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="font-semibold mb-2">Записахме те в списъка с чакащи!</p>
                  {position != null && (
                    <p className="text-sm text-white/50 mb-1">Позиция в списъка: <span className="text-white font-semibold">{position}</span></p>
                  )}
                  <p className="text-sm text-white/50">Ще се свържем с теб по имейл, ако се освободи място.</p>
                  <button onClick={close} className="mt-6 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded hover:bg-white/90">
                    Затвори
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-5">
                    <p className="text-sm text-white/70 leading-relaxed">
                      В момента няма свободни места. Запишете се в списъка с чакащи и ще ви известим по имейл веднага щом се освободи място — <strong className="text-white">това не е резервация и не изисква плащане</strong>.
                    </p>
                  </div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <input {...form.register('name')} placeholder="Име" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form.formState.errors.name && <p className="text-xs text-red-400 mt-1">{form.formState.errors.name.message}</p>}
                    </div>
                    <div>
                      <input {...form.register('email')} type="email" placeholder="Имейл" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form.formState.errors.email && <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <input {...form.register('phone')} type="tel" placeholder="Телефон" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form.formState.errors.phone && <p className="text-xs text-red-400 mt-1">{form.formState.errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Брой участници</label>
                      <input
                        {...form.register('participantCount', { valueAsNumber: true })}
                        type="number" min={1} max={10}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <textarea
                        {...form.register('message')}
                        placeholder="Бележка (по желание) — напр. гъвкавост в датите"
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {submitting ? '...' : 'Запиши се в списъка с чакащи'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
