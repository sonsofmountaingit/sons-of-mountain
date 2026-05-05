'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'

const step1Schema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа'),
  lastName: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Невалиден имейл'),
  phone: z.string().min(6, 'Невалиден телефон'),
})

const step2Schema = z.object({
  participantCount: z.number().min(1).max(10),
  dietaryNotes: z.string().optional(),
  questions: z.string().optional(),
})

const step3Schema = z.object({
  agreedToTerms: z.literal(true, { message: 'Задължително' }),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

interface Trip {
  id: string
  title: string
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  price: number
  currency: string
  status: 'active' | 'soldOut' | 'draft'
  tags: string[]
}

export function BookingFormModal({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isSoldOut = trip.status === 'soldOut' || trip.spotsAvailable === 0

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { participantCount: 1 },
  })
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) })

  function onStep1(data: Step1Data) {
    setStep1Data(data)
    setStep(2)
  }

  function onStep2(data: Step2Data) {
    setStep2Data(data)
    setStep(3)
  }

  async function onStep3() {
    if (!step1Data || !step2Data) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip.id,
          ...step1Data,
          ...step2Data,
          agreedToTerms: true,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
  }

  function close() {
    setOpen(false)
    setStep(1)
    setSubmitted(false)
    form1.reset()
    form2.reset()
    form3.reset()
  }

  const dateRange = `${new Date(trip.startDate).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })} — ${new Date(trip.endDate).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}`

  return (
    <>
      <div className="border border-white/10 rounded-lg p-5 bg-white/5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="text-sm text-white/70">{dateRange}</p>
          {isSoldOut ? (
            <span className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-white/10 text-white/40 rounded-full">НЯМА МЕСТА</span>
          ) : (
            <span className="flex-shrink-0 px-2.5 py-1 text-xs font-semibold bg-white text-black rounded-full">САМО {trip.spotsAvailable} МЕСТА</span>
          )}
        </div>
        {trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {trip.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs border border-white/20 rounded text-white/60">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50">
            от <span className="text-white font-semibold">{trip.price} {trip.currency}</span>
          </p>
          <button
            onClick={() => setOpen(true)}
            disabled={isSoldOut}
            className="px-4 py-2 text-sm font-semibold bg-white text-black rounded hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ЗАПИШИ СЕ
          </button>
        </div>
      </div>

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
              className="w-full max-w-[420px] bg-[#111] border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Записване</p>
                  <p className="text-sm font-medium">{trip.title || dateRange}</p>
                </div>
                <button onClick={close} className="text-white/40 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex gap-1 px-6 py-3 border-b border-white/10">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-0.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-white' : 'bg-white/20'}`} />
                ))}
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="font-semibold mb-2">Заявката е изпратена!</p>
                    <p className="text-sm text-white/50">Ще се свържем с теб до 24 часа.</p>
                    <button onClick={close} className="mt-6 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded hover:bg-white/90">
                      Затвори
                    </button>
                  </div>
                ) : step === 1 ? (
                  <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input {...form1.register('firstName')} placeholder="Име" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                        {form1.formState.errors.firstName && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.firstName.message}</p>}
                      </div>
                      <div>
                        <input {...form1.register('lastName')} placeholder="Фамилия" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                        {form1.formState.errors.lastName && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <input {...form1.register('email')} type="email" placeholder="Имейл" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form1.formState.errors.email && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <input {...form1.register('phone')} type="tel" placeholder="Телефон" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form1.formState.errors.phone && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.phone.message}</p>}
                    </div>
                    <button type="submit" className="w-full py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors">
                      Напред →
                    </button>
                  </form>
                ) : step === 2 ? (
                  <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Брой участници</label>
                      <input
                        {...form2.register('participantCount', { valueAsNumber: true })}
                        type="number" min={1} max={10}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <textarea {...form2.register('dietaryNotes')} placeholder="Хранителни предпочитания / алергии (по желание)" rows={3} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 resize-none" />
                    </div>
                    <div>
                      <textarea {...form2.register('questions')} placeholder="Въпроси (по желание)" rows={3} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-white/20 text-sm font-medium rounded hover:bg-white/5 transition-colors">
                        ← Назад
                      </button>
                      <button type="submit" className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors">
                        Напред →
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 text-sm space-y-1">
                      <p>{step1Data?.firstName} {step1Data?.lastName}</p>
                      <p className="text-white/50">{step1Data?.email}</p>
                      <p className="text-white/50">{step1Data?.phone}</p>
                      <p className="text-white/50">{step2Data?.participantCount} участник(а)</p>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input {...form3.register('agreedToTerms')} type="checkbox" className="mt-0.5 accent-white" />
                      <span className="text-xs text-white/50 leading-relaxed">
                        Съгласявам се с{' '}
                        <a href="/legal/terms" target="_blank" className="underline hover:text-white">общите условия</a>
                        {' '}и{' '}
                        <a href="/legal/cookies" target="_blank" className="underline hover:text-white">политиката за поверителност</a>
                      </span>
                    </label>
                    {form3.formState.errors.agreedToTerms && (
                      <p className="text-xs text-red-400">{form3.formState.errors.agreedToTerms.message}</p>
                    )}
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-white/20 text-sm font-medium rounded hover:bg-white/5 transition-colors">
                        ← Назад
                      </button>
                      <button
                        type="button"
                        onClick={form3.handleSubmit(onStep3)}
                        disabled={submitting}
                        className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
                      >
                        {submitting ? '...' : 'Изпрати'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
