'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslations } from '@/lib/use-translations'

function makeStep1Schema(minCharsMsg: string, invalidEmailMsg: string, invalidPhoneMsg: string) {
  return z.object({
    firstName: z.string().min(2, minCharsMsg),
    lastName: z.string().min(2, minCharsMsg),
    email: z.string().email(invalidEmailMsg),
    phone: z.string().min(6, invalidPhoneMsg),
  })
}

const step2Schema = z.object({
  participantCount: z.number().min(1).max(10),
  carpool: z.enum(['organizer', 'passenger', 'solo'] as const),
  carpoolVehicleType: z.string().optional(),
  carpoolSeats: z.number().min(1).max(8).optional(),
  carpoolFrom: z.string().optional(),
  dietaryNotes: z.string().optional(),
  questions: z.string().optional(),
})

function makeStep3Schema(requiredMsg: string) {
  return z.object({
    agreedToTerms: z.literal(true, { message: requiredMsg }),
  })
}

type Step1Data = z.infer<ReturnType<typeof makeStep1Schema>>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<ReturnType<typeof makeStep3Schema>>

interface CarpoolRide {
  id: string
  vehicleType: string
  seatsAvailable: number
  departureFrom: string
  departureTime: string | null
  organizerName: string
  passengersCount: number
}

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
  const [availableRides, setAvailableRides] = useState<CarpoolRide[]>([])
  const [ridesLoading, setRidesLoading] = useState(false)
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null)

  const isSoldOut = trip.status === 'soldOut' || trip.spotsAvailable === 0
  const { t, language } = useTranslations()

  const form1 = useForm<Step1Data>({ resolver: zodResolver(makeStep1Schema(t.booking_form.min_chars, t.booking_form.invalid_email, t.booking_form.invalid_phone)) })
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { participantCount: 1, carpool: 'solo' },
  })
  const form3 = useForm<Step3Data>({ resolver: zodResolver(makeStep3Schema(t.booking_form.required)) })

  const carpoolValue = form2.watch('carpool')

  useEffect(() => {
    if (carpoolValue !== 'passenger') {
      setAvailableRides([])
      setSelectedRideId(null)
      return
    }
    setRidesLoading(true)
    fetch(`/api/carpool-rides-search?tripId=${trip.id}`)
      .then((r) => r.json())
      .then((data) => setAvailableRides(data.rides ?? []))
      .catch(() => setAvailableRides([]))
      .finally(() => setRidesLoading(false))
  }, [carpoolValue, trip.id])

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
          ...(step2Data.carpool === 'passenger' && selectedRideId ? { carpoolRideId: selectedRideId } : {}),
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
    setSelectedRideId(null)
    setAvailableRides([])
    form1.reset()
    form2.reset()
    form3.reset()
  }

  const locale = language === 'EN' ? 'en-US' : 'bg-BG'
  const dateRange = `${new Date(trip.startDate).toLocaleDateString(locale, { day: 'numeric', month: 'long' })} — ${new Date(trip.endDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`
  const selectedRide = availableRides.find((r) => r.id === selectedRideId)

  return (
    <>
      <div className="border border-white/10 rounded-lg p-5 bg-white/5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="text-sm text-white/70">{dateRange}</p>
          {isSoldOut ? (
            <span className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-white/10 text-white/40 rounded-full">{t.booking_form.no_spots}</span>
          ) : (
            <span className="flex-shrink-0 px-2.5 py-1 text-xs font-semibold bg-white text-black rounded-full">{t.booking_form.only_spots_prefix} {trip.spotsAvailable} {t.booking_form.only_spots_suffix}</span>
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
            {t.booking_form.from_price} <span className="text-white font-semibold">{trip.price} {trip.currency}</span>
          </p>
          <button
            onClick={() => setOpen(true)}
            disabled={isSoldOut}
            className="px-4 py-2 text-sm font-semibold bg-white text-black rounded hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.booking_form.sign_up}
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
              className="w-full max-w-[420px] bg-[#111] border border-white/10 rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{t.booking_form.signup_title}</p>
                  <p className="text-sm font-medium">{trip.title || dateRange}</p>
                </div>
                <button onClick={close} className="text-white/40 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex gap-1 px-6 py-3 border-b border-white/10 flex-shrink-0">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-0.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-white' : 'bg-white/20'}`} />
                ))}
              </div>

              <div className="p-6 overflow-y-auto">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="font-semibold mb-2">{t.booking_form.submitted_title}</p>
                    <p className="text-sm text-white/50">{t.booking_form.submitted_subtext}</p>
                    <button onClick={close} className="mt-6 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded hover:bg-white/90">
                      {t.booking_form.close}
                    </button>
                  </div>
                ) : step === 1 ? (
                  <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input {...form1.register('firstName')} placeholder={t.booking_form.first_name} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                        {form1.formState.errors.firstName && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.firstName.message}</p>}
                      </div>
                      <div>
                        <input {...form1.register('lastName')} placeholder={t.booking_form.last_name} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                        {form1.formState.errors.lastName && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <input {...form1.register('email')} type="email" placeholder={t.booking_form.email} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form1.formState.errors.email && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <input {...form1.register('phone')} type="tel" placeholder={t.booking_form.phone} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30" />
                      {form1.formState.errors.phone && <p className="text-xs text-red-400 mt-1">{form1.formState.errors.phone.message}</p>}
                    </div>
                    <button type="submit" className="w-full py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors">
                      {t.booking_form.next}
                    </button>
                  </form>
                ) : step === 2 ? (
                  <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">{t.booking_form.participant_count}</label>
                      <input
                        {...form2.register('participantCount', { valueAsNumber: true })}
                        type="number" min={1} max={10}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/50 mb-2 block">{t.booking_form.carpool_label}</label>
                      <div className="space-y-2">
                        {([
                          ['organizer', t.booking_form.carpool_organizer],
                          ['passenger', t.booking_form.carpool_passenger],
                          ['solo', t.booking_form.carpool_solo],
                        ] as const).map(([val, label]) => (
                          <label key={val} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              {...form2.register('carpool')}
                              type="radio"
                              value={val}
                              className="accent-white"
                            />
                            <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Organizer fields */}
                      {carpoolValue === 'organizer' && (
                        <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                          <div>
                            <label className="text-xs text-white/50 mb-1.5 block">{t.booking_form.vehicle_type_label}</label>
                            <input
                              {...form2.register('carpoolVehicleType')}
                              placeholder={t.booking_form.vehicle_type_placeholder}
                              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-white/50 mb-1.5 block">{t.booking_form.free_seats_label}</label>
                            <input
                              {...form2.register('carpoolSeats', { valueAsNumber: true })}
                              type="number" min={1} max={8}
                              placeholder={t.booking_form.free_seats_placeholder}
                              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
                            />
                            {form2.formState.errors.carpoolSeats && (
                              <p className="text-xs text-red-400 mt-1">{form2.formState.errors.carpoolSeats.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-white/50 mb-1.5 block">{t.booking_form.departure_from_label}</label>
                            <input
                              {...form2.register('carpoolFrom')}
                              placeholder={t.booking_form.departure_from_placeholder}
                              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30"
                            />
                          </div>
                        </div>
                      )}

                      {/* Passenger — available rides */}
                      {carpoolValue === 'passenger' && (
                        <div className="mt-3 border-t border-white/10 pt-3">
                          <p className="text-xs text-white/50 mb-2">{t.booking_form.available_rides}</p>
                          {ridesLoading ? (
                            <p className="text-xs text-white/30">{t.booking_form.loading}</p>
                          ) : availableRides.length === 0 ? (
                            <p className="text-xs text-white/30">{t.booking_form.no_rides}</p>
                          ) : (
                            <div className="space-y-2">
                              {availableRides.map((ride) => (
                                <button
                                  key={ride.id}
                                  type="button"
                                  onClick={() => setSelectedRideId(ride.id === selectedRideId ? null : ride.id)}
                                  className={`w-full text-left px-3 py-2.5 rounded border text-sm transition-colors ${
                                    selectedRideId === ride.id
                                      ? 'border-white bg-white/10 text-white'
                                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                                  }`}
                                >
                                  <div className="font-medium">{ride.departureFrom}</div>
                                  <div className="text-xs text-white/50 mt-0.5">
                                    {ride.vehicleType} · {ride.seatsAvailable - ride.passengersCount} {t.booking_form.free_seats_short} · {ride.organizerName}
                                  </div>
                                  {ride.departureTime && (
                                    <div className="text-xs text-white/40 mt-0.5">
                                      {new Date(ride.departureTime).toLocaleDateString(locale, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <textarea {...form2.register('dietaryNotes')} placeholder={t.booking_form.dietary_placeholder} rows={2} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 resize-none" />
                    </div>
                    <div>
                      <textarea {...form2.register('questions')} placeholder={t.booking_form.questions_placeholder} rows={2} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-white/20 text-sm font-medium rounded hover:bg-white/5 transition-colors">
                        ← {t.booking_form.back}
                      </button>
                      <button type="submit" className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors">
                        {t.booking_form.next}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 text-sm space-y-1">
                      <p>{step1Data?.firstName} {step1Data?.lastName}</p>
                      <p className="text-white/50">{step1Data?.email}</p>
                      <p className="text-white/50">{step1Data?.phone}</p>
                      <p className="text-white/50">{step2Data?.participantCount} {t.booking_form.participants_suffix}</p>
                      {step2Data?.carpool === 'organizer' && (
                        <>
                          <p className="text-white/50">{t.booking_form.carpool_organizer_summary}</p>
                          {step2Data.carpoolVehicleType && <p className="text-white/50">{t.booking_form.vehicle_summary} {step2Data.carpoolVehicleType}</p>}
                          {step2Data.carpoolSeats && <p className="text-white/50">{t.booking_form.free_seats_summary} {step2Data.carpoolSeats}</p>}
                          {step2Data.carpoolFrom && <p className="text-white/50">{t.booking_form.departure_summary} {step2Data.carpoolFrom}</p>}
                        </>
                      )}
                      {step2Data?.carpool === 'passenger' && (
                        <>
                          <p className="text-white/50">{t.booking_form.carpool_passenger_summary}</p>
                          {selectedRide && (
                            <p className="text-white/50">{t.booking_form.selected_ride} {selectedRide.departureFrom} · {selectedRide.vehicleType}</p>
                          )}
                        </>
                      )}
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input {...form3.register('agreedToTerms')} type="checkbox" className="mt-0.5 accent-white" />
                      <span className="text-xs text-white/50 leading-relaxed">
                        {t.booking_form.agree_prefix} {' '}
                        <a href="/legal/terms" target="_blank" className="underline hover:text-white">{t.booking_form.terms_link}</a>
                        {' '}{t.booking_form.and}{' '}
                        <a href="/legal/privacy-policy" target="_blank" className="underline hover:text-white">{t.booking_form.privacy_link}</a>
                      </span>
                    </label>
                    {form3.formState.errors.agreedToTerms && (
                      <p className="text-xs text-red-400">{form3.formState.errors.agreedToTerms.message}</p>
                    )}
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-white/20 text-sm font-medium rounded hover:bg-white/5 transition-colors">
                        ← {t.booking_form.back}
                      </button>
                      <button
                        type="button"
                        onClick={form3.handleSubmit(onStep3)}
                        disabled={submitting}
                        className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors disabled:opacity-50"
                      >
                        {submitting ? '...' : t.booking_form.send}
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
