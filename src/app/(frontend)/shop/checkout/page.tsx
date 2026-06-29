'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { CartItemRow } from '@/components/shop/CartItem'
import { DiscountCodeInput } from '@/components/shop/DiscountCodeInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { toast } from 'sonner'

const infoSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(6, 'Required'),
  paymentMode: z.enum(['full', 'deposit', 'installments']),
})

type InfoForm = z.infer<typeof infoSchema>
type ParticipationType = 'organizer' | 'join' | 'solo'

interface CarpoolRide {
  id: string
  vehicleType: string
  seatsAvailable: number
  departureFrom: string
  departureTime: string | null
  organizerName: string
  passengersCount: number
}

const participationTabs: { value: ParticipationType; label: string }[] = [
  { value: 'organizer', label: 'Аз съм организатор на споделено пътуване' },
  { value: 'join', label: 'Искам да участвам в споделено пътуване' },
  { value: 'solo', label: 'Сам ще дойда' },
]

const steps = ['Info', 'Review', 'Payment']

const inputCls = 'w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50'
const labelCls = 'block text-sm font-medium mb-1 text-white/80'

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [participationType, setParticipationType] = useState<ParticipationType>('solo')

  // Organizer fields
  const [vehicleType, setVehicleType] = useState('')
  const [seatsAvailable, setSeatsAvailable] = useState(1)
  const [departureFrom, setDepartureFrom] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [rideNotes, setRideNotes] = useState('')

  // Join fields
  const [rides, setRides] = useState<CarpoolRide[]>([])
  const [ridesLoading, setRidesLoading] = useState(false)
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null)

  const { items, subtotal, discountAmount, voucherAmount, total, loyaltyPointsToRedeem, appliedDiscount, corporatePeopleCount } = useCartStore()

  const hasRideable = items.some((i) => i.type === 'trip' || i.type === 'program')
  const tripItem = items.find((i) => i.type === 'trip' || i.type === 'program')
  const tripId = tripItem?.tripId ?? null
  const programId = tripItem?.programId ?? null

  useEffect(() => {
    if (participationType !== 'join' || !hasRideable) return
    setRidesLoading(true)
    const params = new URLSearchParams()
    if (tripId) params.set('tripId', tripId)
    else if (programId) params.set('programId', programId)
    fetch(`/api/carpool-rides?${params}`)
      .then((r) => r.json())
      .then((d) => setRides(d.rides ?? []))
      .catch(() => setRides([]))
      .finally(() => setRidesLoading(false))
  }, [participationType, tripId, programId, hasRideable])

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<InfoForm>({
    resolver: zodResolver(infoSchema),
    defaultValues: { paymentMode: 'full' },
  })

  function validateCarpoolFields(): boolean {
    if (!hasRideable) return true
    if (participationType === 'organizer') {
      if (!vehicleType.trim()) { toast.error('Въведете тип превозно средство'); return false }
      if (!departureFrom.trim()) { toast.error('Въведете място на тръгване'); return false }
    }
    if (participationType === 'join' && !selectedRideId) {
      toast.error('Изберете споделено пътуване'); return false
    }
    return true
  }

  async function goToPayment() {
    setLoading(true)
    try {
      const info = getValues()

      const carpoolPayload =
        hasRideable && participationType === 'organizer'
          ? { participationType: 'organizer', carpool: { vehicleType, seatsAvailable, departureFrom, departureTime: departureTime || null, notes: rideNotes || null, organizerName: `${info.firstName} ${info.lastName}`, organizerEmail: info.email, organizerPhone: info.phone, tripId, programId } }
          : hasRideable && participationType === 'join'
          ? { participationType: 'join', carpoolRideId: selectedRideId }
          : { participationType: 'solo' }

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
          loyaltyPointsRedeemed: loyaltyPointsToRedeem,
          corporatePeopleCount,
          enableBnpl: true,
          ...carpoolPayload,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? 'Checkout failed')
    } catch {
      toast.error('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-white/50 mb-4">Количката е празна.</p>
        <Link href="/shop" className="rounded bg-white px-6 py-3 text-sm font-semibold text-gray-900">Към магазина</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-28 pb-16">
      {/* Steps */}
      <nav className="mb-10 flex gap-2" aria-label="Checkout steps">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${i <= step ? 'bg-white text-gray-900' : 'bg-white/10 text-white/40'}`}>{i + 1}</div>
            <span className={`text-sm ${i === step ? 'font-semibold text-white' : 'text-white/40'}`}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-white/20" />}
          </div>
        ))}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Step 0: Info */}
          {step === 0 && (
            <form
              onSubmit={handleSubmit(() => {
                if (!validateCarpoolFields()) return
                setStep(1)
              })}
              className="space-y-5"
            >
              <h2 className="text-xl font-semibold text-white">Информация за контакт</h2>

              {/* Participation tabs — only when cart has trip/program */}
              {hasRideable && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Начин на пристигане</p>
                  <div className="flex rounded-lg border border-white/20 overflow-hidden">
                    {participationTabs.map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => { setParticipationType(tab.value); setSelectedRideId(null) }}
                        className={`flex-1 px-3 py-3 text-xs font-medium text-center transition-colors leading-tight ${participationType === tab.value ? 'bg-white text-gray-900' : 'bg-transparent text-white/50 hover:text-white'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Organizer extra fields */}
                  {participationType === 'organizer' && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
                      <p className="text-xs text-white/50 uppercase tracking-wide font-medium">Данни за споделеното пътуване</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>Тип превозно средство *</label>
                          <input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="напр. SUV, седан, бус..." className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Свободни места *</label>
                          <input type="number" min={1} max={8} value={seatsAvailable} onChange={(e) => setSeatsAvailable(Number(e.target.value))} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Тръгване от *</label>
                        <input value={departureFrom} onChange={(e) => setDepartureFrom(e.target.value)} placeholder="напр. София, кв. Лозенец..." className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Час/дата на тръгване</label>
                        <input type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Бележки</label>
                        <textarea value={rideNotes} onChange={(e) => setRideNotes(e.target.value)} rows={2} className={inputCls} />
                      </div>
                    </div>
                  )}

                  {/* Join — list of open rides */}
                  {participationType === 'join' && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                      <p className="text-xs text-white/50 uppercase tracking-wide font-medium">Налични споделени пътувания</p>
                      {ridesLoading && <p className="text-sm text-white/40">Зареждане...</p>}
                      {!ridesLoading && rides.length === 0 && (
                        <p className="text-sm text-white/40">Няма налични споделени пътувания за тази дестинация.</p>
                      )}
                      {!ridesLoading && rides.map((ride) => {
                        const seats = ride.seatsAvailable - ride.passengersCount
                        const full = seats <= 0
                        return (
                          <button
                            key={ride.id}
                            type="button"
                            disabled={full}
                            onClick={() => setSelectedRideId(ride.id)}
                            className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${selectedRideId === ride.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'} ${full ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">{ride.vehicleType} · {ride.departureFrom}</span>
                              <span className={`text-xs font-semibold ${full ? 'text-red-400' : 'text-green-400'}`}>
                                {full ? 'Запълнено' : `${seats} място${seats === 1 ? '' : 'а'}`}
                              </span>
                            </div>
                            {ride.organizerName && <p className="text-xs text-white/50 mt-0.5">Организатор: {ride.organizerName}</p>}
                            {ride.departureTime && (
                              <p className="text-xs text-white/50">{new Date(ride.departureTime).toLocaleString('bg-BG')}</p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Contact fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Име</label>
                  <input {...register('firstName')} className={inputCls} />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Фамилия</label>
                  <input {...register('lastName')} className={inputCls} />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className={labelCls}>Имейл</label>
                <input {...register('email')} type="email" className={inputCls} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Телефон</label>
                <input {...register('phone')} type="tel" className={inputCls} />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
              </div>

              {hasRideable && (
                <div>
                  <label className={labelCls}>Начин на плащане</label>
                  <div className="space-y-2 mt-1">
                    {['full', 'deposit', 'installments'].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input {...register('paymentMode')} type="radio" value={mode} />
                        <span className="text-sm text-white/80">
                          {mode === 'full' && 'Пълно плащане'}
                          {mode === 'deposit' && 'Плати депозит сега'}
                          {mode === 'installments' && 'На вноски (Klarna / Afterpay)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="w-full rounded bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-white/90">
                Продължи към преглед
              </button>
            </form>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Преглед на поръчката</h2>
              <div className="divide-y divide-white/10 border border-white/10 rounded-lg bg-white/5">
                {items.map((item) => <CartItemRow key={`${item.id}-${item.variantId}`} item={item} />)}
              </div>
              <DiscountCodeInput />
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="rounded border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">Назад</button>
                <button onClick={() => setStep(2)} className="flex-1 rounded bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-white/90">Продължи към плащане</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Плащане</h2>
              <p className="text-sm text-white/50">Ще бъдете пренасочени към Stripe за сигурно плащане. Поддържа Klarna, Afterpay и карта.</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">Назад</button>
                <button
                  onClick={goToPayment}
                  disabled={loading}
                  className="flex-1 rounded bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 disabled:opacity-50"
                >
                  {loading ? 'Пренасочване...' : `Плати €${total().toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 h-fit space-y-3 text-sm text-white">
          <h3 className="font-semibold text-base">Обобщение</h3>
          <div className="flex justify-between text-white/70"><span>Междинна сума</span><span>€{subtotal().toFixed(2)}</span></div>
          {discountAmount() > 0 && <div className="flex justify-between text-green-400"><span>Отстъпка ({appliedDiscount?.code})</span><span>−€{discountAmount().toFixed(2)}</span></div>}
          {voucherAmount() > 0 && <div className="flex justify-between text-green-400"><span>Ваучер</span><span>−€{voucherAmount().toFixed(2)}</span></div>}
          {loyaltyPointsToRedeem > 0 && <div className="flex justify-between text-green-400"><span>Точки ({loyaltyPointsToRedeem} бр.)</span><span>−€{(loyaltyPointsToRedeem / 100).toFixed(2)}</span></div>}
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-base"><span>Общо</span><span>€{total().toFixed(2)}</span></div>
        </div>
      </div>
    </main>
  )
}
