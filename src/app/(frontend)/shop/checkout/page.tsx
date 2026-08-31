'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { CartItemRow } from '@/components/shop/CartItem'
import { VoucherCodeInput } from '@/components/shop/VoucherCodeInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/currency'
import { useSession } from '@/lib/auth-client'
import { useTranslations } from '@/lib/use-translations'
import type { Translations } from '@/lib/translations'
import { gtagEvent, fireOncePerSession } from '@/lib/gtag'
import { Turnstile } from '@/components/auth/Turnstile'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function makeInfoSchema(requiredMsg: string, invalidEmailMsg: string, emailsMismatchMsg: string) {
  return z.object({
    firstName: z.string().min(1, requiredMsg),
    lastName: z.string().min(1, requiredMsg),
    email: z.string().trim().email(invalidEmailMsg),
    confirmEmail: z.string().trim().email(invalidEmailMsg),
    phone: z.string().min(6, requiredMsg),
    paymentMode: z.enum(['full', 'deposit', 'installments']).optional(),
  }).refine((values) => normalizeEmail(values.email) === normalizeEmail(values.confirmEmail), {
    message: emailsMismatchMsg,
    path: ['confirmEmail'],
  })
}

type InfoForm = z.infer<ReturnType<typeof makeInfoSchema>>
type ParticipationType = 'organizer' | 'join' | 'solo'

interface PlanInstallment {
  label: string
  amount: number
  dueDate: string
}

interface PaymentPlanPreview {
  mode: 'full' | 'deposit' | 'installments'
  installments: PlanInstallment[]
}

function getPlanCopy(t: Translations): Record<PaymentPlanPreview['mode'], string> {
  return {
    full: t.checkout_page.plan_full,
    deposit: t.checkout_page.plan_deposit,
    installments: t.checkout_page.plan_installments,
  }
}

interface CarpoolRide {
  id: string
  vehicleType: string
  seatsAvailable: number
  departureFrom: string
  departureTime: string | null
  organizerName: string
  passengersCount: number
}

function getParticipationTabs(t: Translations): { value: ParticipationType; label: string }[] {
  return [
    { value: 'organizer', label: t.checkout_page.tab_organizer },
    { value: 'join', label: t.checkout_page.tab_join },
    { value: 'solo', label: t.checkout_page.tab_solo },
  ]
}

const inputCls = 'w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50'
const labelCls = 'block text-sm font-medium mb-1 text-white/80'

export default function CheckoutPage() {
  const { data: sessionData, isPending: sessionLoading } = useSession()
  const { t, language } = useTranslations()
  const locale = language === 'EN' ? 'en-US' : 'bg-BG'
  const confirmEmailLabel = language === 'EN' ? 'Confirm email' : 'Потвърдете имейла'
  const emailsMatchMessage = language === 'EN' ? 'Email addresses match.' : 'Имейл адресите съвпадат.'
  const emailsMismatchMessage = language === 'EN' ? 'Email addresses do not match.' : 'Имейл адресите не съвпадат.'
  const typeEmailManuallyMessage = language === 'EN' ? 'Please type your email again manually.' : 'Моля, въведете имейла си отново ръчно.'
  const steps = [t.checkout_page.step_info, t.checkout_page.step_review, t.checkout_page.step_payment]
  const planCopy = getPlanCopy(t)
  const participationTabs = getParticipationTabs(t)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
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

  const { items, subtotal, discountAmount, voucherAmount, total, loyaltyPointsToRedeem, appliedDiscount, appliedVoucher, corporatePeopleCount, preferredCurrency } = useCartStore()

  const hasRideable = items.some((i) => i.type === 'trip' || i.type === 'program' || i.type === 'destination')
  const tripItem = items.find((i) => i.type === 'trip' || i.type === 'program' || i.type === 'destination')
  const tripId = tripItem?.tripId ?? null
  const programId = tripItem?.programId ?? null
  const destinationIdForRide = tripItem?.destinationId ?? null

  const bookableItem = items.find((i) => i.type === 'trip' || i.type === 'program' || i.type === 'destination')
  const bookableItemType = bookableItem?.type ?? null

  const cartKey = items.map((i) => `${i.id}:${i.variantId ?? ''}:${i.quantity}`).sort().join('|')

  useEffect(() => {
    if (!items.length) return
    fireOncePerSession(`som_begin_checkout_${cartKey}`, () => {
      gtagEvent('begin_checkout', {
        currency: preferredCurrency,
        value: total(),
        items: items.map((i) => ({
          item_id: i.id,
          item_name: i.title,
          price: i.unitPrice,
          item_category: i.type,
          quantity: i.quantity,
        })),
      })
    })
  }, [items, total, preferredCurrency, cartKey])
  const bookableItemId = bookableItem?.tripId ?? bookableItem?.programId ?? bookableItem?.destinationId ?? null
  // Use the actual charged amount (accounts for early-bird pricing mix, quantity) rather than
  // the record's flat regular price, so deposit/installment splits sum to what's really due.
  const bookableItemAmount = bookableItem
    ? (bookableItem.priceBreakdown?.totalPrice ?? bookableItem.unitPrice * bookableItem.quantity)
    : null

  const [naturalPlan, setNaturalPlan] = useState<PaymentPlanPreview | null>(null)
  const [fullPlan, setFullPlan] = useState<PaymentPlanPreview | null>(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [payInFull, setPayInFull] = useState(false)

  useEffect(() => {
    if (!bookableItemType || !bookableItemId || bookableItemAmount == null) { setNaturalPlan(null); setFullPlan(null); return }
    setPlanLoading(true)
    const naturalParams = new URLSearchParams({ itemType: bookableItemType, itemId: bookableItemId, payInFull: 'false', amount: String(bookableItemAmount) })
    const fullParams = new URLSearchParams({ itemType: bookableItemType, itemId: bookableItemId, payInFull: 'true', amount: String(bookableItemAmount) })
    Promise.all([
      fetch(`/api/payment-plan?${naturalParams}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/payment-plan?${fullParams}`).then((r) => r.json()).catch(() => null),
    ])
      .then(([natural, full]) => {
        setNaturalPlan(natural?.mode ? natural : null)
        setFullPlan(full?.mode ? full : null)
        setPayInFull(false)
      })
      .finally(() => setPlanLoading(false))
  }, [bookableItemType, bookableItemId, bookableItemAmount])

  const plan = payInFull ? fullPlan : naturalPlan
  const canChooseFull = naturalPlan && naturalPlan.mode !== 'full'

  useEffect(() => {
    if (participationType !== 'join' || !hasRideable) return
    setRidesLoading(true)
    const params = new URLSearchParams()
    if (tripId) params.set('tripId', tripId)
    else if (programId) params.set('programId', programId)
    else if (destinationIdForRide) params.set('destinationId', destinationIdForRide)
    fetch(`/api/carpool-rides-search?${params}`)
      .then((r) => r.json())
      .then((d) => setRides(d.rides ?? []))
      .catch(() => setRides([]))
      .finally(() => setRidesLoading(false))
  }, [participationType, tripId, programId, destinationIdForRide, hasRideable])

  const { register, handleSubmit, getValues, setValue, watch, trigger, formState: { errors } } = useForm<InfoForm>({
    resolver: zodResolver(makeInfoSchema(t.checkout_page.required, t.checkout_page.invalid_email, emailsMismatchMessage)),
    defaultValues: { paymentMode: 'full' },
  })
  const email = watch('email')
  const confirmEmail = watch('confirmEmail')
  const emailsMatch = Boolean(email && confirmEmail && normalizeEmail(email) === normalizeEmail(confirmEmail))

  useEffect(() => {
    if (!sessionData?.user) return
    const [firstName, ...rest] = (sessionData.user.name ?? '').split(' ')
    if (firstName) setValue('firstName', firstName)
    if (rest.length) setValue('lastName', rest.join(' '))
    if (sessionData.user.email) setValue('email', sessionData.user.email)
  }, [sessionData, setValue])

  function validateCarpoolFields(): boolean {
    if (!hasRideable) return true
    if (participationType === 'organizer') {
      if (!vehicleType.trim()) { toast.error(t.checkout_page.enter_vehicle_type); return false }
      if (!departureFrom.trim()) { toast.error(t.checkout_page.enter_departure_place); return false }
    }
    return true
  }

  async function goToPayment() {
    // Validate again immediately before creating a payment session. This protects
    // against stale form state after navigating back from the review step.
    if (!(await trigger())) {
      setStep(0)
      return
    }

    setLoading(true)
    try {
      const info = getValues()

      gtagEvent('add_payment_info', {
        currency: preferredCurrency,
        value: total(),
        payment_type: payInFull ? 'full' : (plan?.mode ?? info.paymentMode ?? 'unknown'),
        items: items.map((i) => ({
          item_id: i.id,
          item_name: i.title,
          price: i.unitPrice,
          item_category: i.type,
          quantity: i.quantity,
        })),
      })

      const carpoolPayload =
        hasRideable && participationType === 'organizer'
          ? { participationType: 'organizer', carpool: { vehicleType, seatsAvailable, departureFrom, departureTime: departureTime || null, notes: rideNotes || null, organizerName: `${info.firstName} ${info.lastName}`, organizerEmail: info.email, organizerPhone: info.phone, tripId, programId, destinationId: destinationIdForRide } }
          : hasRideable && participationType === 'join'
          ? { participationType: 'join', carpoolRideId: selectedRideId }
          : { participationType: 'solo' }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({
          type: 'cart',
          items,
          currency: 'eur',
          orderTotal: total(),
          customerEmail: normalizeEmail(info.email),
          confirmEmail: normalizeEmail(info.confirmEmail),
          firstName: info.firstName,
          lastName: info.lastName,
          phone: info.phone,
          paymentMode: payInFull ? 'full' : (plan?.mode ?? info.paymentMode),
          loyaltyPointsRedeemed: loyaltyPointsToRedeem,
          corporatePeopleCount,
          discountCodeId: appliedDiscount?.id ?? null,
          giftVoucherId: appliedVoucher?.id ?? null,
          enableBnpl: true,
          ...carpoolPayload,
          captchaToken,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? t.checkout_page.checkout_failed)
    } catch {
      toast.error(t.checkout_page.checkout_failed)
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return <main className="min-h-screen" />
  }

  if (!items.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-white/50 mb-4">{t.checkout_page.cart_empty}</p>
        <Link href="/shop" className="rounded bg-white px-6 py-3 text-sm font-semibold text-gray-900">{t.checkout_page.to_shop}</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-28 pb-16">
      {/* Steps */}
      <nav className="mb-10 flex gap-2" aria-label={t.checkout_page.checkout_steps_label}>
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
                toast.success(emailsMatchMessage)
                setStep(1)
              }, (formErrors) => {
                if (formErrors.confirmEmail?.message === emailsMismatchMessage) {
                  toast.error(emailsMismatchMessage)
                }
              })}
              className="space-y-5"
            >
              <h2 className="text-xl font-semibold text-white">{t.checkout_page.contact_info}</h2>

              {/* Participation tabs — only when cart has trip/program */}
              {hasRideable && (
                <div>
                  <p className="text-sm text-white/60 mb-2">{t.checkout_page.arrival_method}</p>
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
                      <p className="text-xs text-white/50 uppercase tracking-wide font-medium">{t.checkout_page.shared_ride_data}</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>{t.checkout_page.vehicle_type_required}</label>
                          <input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder={t.checkout_page.vehicle_type_placeholder} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>{t.checkout_page.free_seats_required}</label>
                          <input type="number" min={1} max={8} value={seatsAvailable} onChange={(e) => setSeatsAvailable(Number(e.target.value))} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>{t.checkout_page.departure_from_required}</label>
                        <input value={departureFrom} onChange={(e) => setDepartureFrom(e.target.value)} placeholder={t.checkout_page.departure_from_placeholder} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{t.checkout_page.departure_datetime}</label>
                        <input type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{t.checkout_page.notes}</label>
                        <textarea value={rideNotes} onChange={(e) => setRideNotes(e.target.value)} rows={2} className={inputCls} />
                      </div>
                    </div>
                  )}

                  {/* Join — list of open rides */}
                  {participationType === 'join' && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                      <p className="text-xs text-white/50 uppercase tracking-wide font-medium">{t.checkout_page.available_shared_rides}</p>
                      {ridesLoading && <p className="text-sm text-white/40">{t.checkout_page.loading}</p>}
                      {!ridesLoading && rides.length === 0 && (
                        <p className="text-sm text-white/40">{t.checkout_page.no_shared_rides}</p>
                      )}
                      {/* A transport request is needed only when no ride can be joined. */}
                      {!ridesLoading && rides.length === 0 && (
                        <p className="text-sm text-green-300/80">{t.checkout_page.transport_request_saved}</p>
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
                                {full ? t.checkout_page.full : `${seats} ${seats === 1 ? t.checkout_page.spot_singular : t.checkout_page.spot_plural}`}
                              </span>
                            </div>
                            {ride.organizerName && <p className="text-xs text-white/50 mt-0.5">{t.checkout_page.organizer_label} {ride.organizerName}</p>}
                            {ride.departureTime && (
                              <p className="text-xs text-white/50">{new Date(ride.departureTime).toLocaleString(locale)}</p>
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
                  <label className={labelCls}>{t.checkout_page.first_name}</label>
                  <input {...register('firstName')} className={inputCls} />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>{t.checkout_page.last_name}</label>
                  <input {...register('lastName')} className={inputCls} />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className={labelCls}>{t.checkout_page.email}</label>
                <input {...register('email')} type="email" className={inputCls} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelCls}>{confirmEmailLabel}</label>
                <input
                  {...register('confirmEmail')}
                  type="email"
                  autoComplete="off"
                  onPaste={(event) => { event.preventDefault(); toast.error(typeEmailManuallyMessage) }}
                  onDrop={(event) => { event.preventDefault(); toast.error(typeEmailManuallyMessage) }}
                  className={inputCls}
                />
                {confirmEmail && !emailsMatch && !errors.confirmEmail && (
                  <p className="text-xs text-red-400 mt-1">{emailsMismatchMessage}</p>
                )}
                {errors.confirmEmail && <p className="text-xs text-red-400 mt-1">{errors.confirmEmail.message}</p>}
              </div>
              <div>
                <label className={labelCls}>{t.checkout_page.phone}</label>
                <input {...register('phone')} type="tel" className={inputCls} />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
              </div>

              {bookableItem && (
                <div>
                  <label className={labelCls}>{t.checkout_page.payment_system}</label>
                  {planLoading || !naturalPlan ? (
                    <p className="text-sm text-white/40 mt-1">{t.checkout_page.loading_payment_plan}</p>
                  ) : (
                    <div className="mt-1 space-y-3">
                      {canChooseFull ? (
                        <div className="space-y-2">
                          <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${!payInFull ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
                            <input type="radio" checked={!payInFull} onChange={() => setPayInFull(false)} className="accent-white mt-1" />
                            <span>
                              <span className="block text-sm font-medium text-white">
                                {naturalPlan.mode === 'deposit' ? t.checkout_page.deposit_plus_balance : t.checkout_page.three_installments}
                              </span>
                              <span className="block text-xs text-white/50 leading-relaxed mt-0.5">{planCopy[naturalPlan.mode]}</span>
                            </span>
                          </label>
                          <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${payInFull ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
                            <input type="radio" checked={payInFull} onChange={() => setPayInFull(true)} className="accent-white mt-1" />
                            <span>
                              <span className="block text-sm font-medium text-white">{t.checkout_page.full_payment}</span>
                              <span className="block text-xs text-white/50 leading-relaxed mt-0.5">{t.checkout_page.full_payment_desc}</span>
                            </span>
                          </label>
                        </div>
                      ) : (
                        <p className="text-xs text-white/50 leading-relaxed">{planCopy[naturalPlan.mode]}</p>
                      )}

                      {plan && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
                          {plan.installments.map((inst, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-white/70">{inst.label}</span>
                              <span className="text-white font-medium">
                                {formatPrice(inst.amount)}
                                <span className="text-white/40 ml-2 text-xs">
                                  {new Date(inst.dueDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {plan?.mode !== 'full' && (
                        <p className="text-xs text-white/40 leading-relaxed">
                          {t.checkout_page.grace_period_notice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!emailsMatch}
                className="w-full rounded bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.checkout_page.continue_to_review}
              </button>
            </form>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">{t.checkout_page.order_review}</h2>
              <div className="divide-y divide-white/10 border border-white/10 rounded-lg bg-white/5">
                {items.map((item) => <CartItemRow key={`${item.id}-${item.variantId}`} item={item} />)}
              </div>
              <VoucherCodeInput />
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="rounded border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">{t.checkout_page.back}</button>
                <button onClick={() => setStep(2)} className="flex-1 rounded bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-white/90">{t.checkout_page.continue_to_payment}</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">{t.checkout_page.payment_title}</h2>
              <p className="text-sm text-white/50">{t.checkout_page.stripe_redirect_notice}</p>
              {!sessionData?.user && <Turnstile onToken={setCaptchaToken} />}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">{t.checkout_page.back}</button>
                <button
                  onClick={goToPayment}
                  disabled={loading}
                  className="flex-1 rounded bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-white/90 disabled:opacity-50"
                >
                  {loading ? t.checkout_page.redirecting : `${t.checkout_page.pay} ${formatPrice(total())}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 h-fit space-y-3 text-sm text-white">
          <h3 className="font-semibold text-base">{t.checkout_page.summary}</h3>
          <div className="space-y-2 border-b border-white/10 pb-3">
            {items.map((item) => {
              const pb = item.priceBreakdown
              const hasEarlyBird = !!pb && pb.earlyBirdCount > 0
              return (
                <div key={`${item.id}-${item.variantId}`} className="space-y-1">
                  <div className="flex justify-between text-white/80">
                    <span className="truncate pr-2">{item.title}{item.variantLabel ? ` · ${item.variantLabel}` : ''}</span>
                    <span>{formatPrice(pb?.totalPrice ?? item.unitPrice * item.quantity)}</span>
                  </div>
                  {hasEarlyBird ? (
                    <div className="pl-3 space-y-0.5 text-xs text-white/50">
                      <div className="flex justify-between">
                        <span>{t.checkout_page.early_bird_x} {pb.earlyBirdCount}</span>
                        <span>{formatPrice(pb.earlyBirdPrice * pb.earlyBirdCount)}</span>
                      </div>
                      {pb.regularCount > 0 && (
                        <div className="flex justify-between">
                          <span>{t.checkout_page.regular_price_x} {pb.regularCount}</span>
                          <span>{formatPrice(pb.regularPrice * pb.regularCount)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pl-3 text-xs text-white/50 flex justify-between">
                      <span>{item.quantity} × {formatPrice(item.unitPrice)}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-white/70"><span>{t.checkout_page.subtotal}</span><span>{formatPrice(subtotal())}</span></div>
          {discountAmount() > 0 && <div className="flex justify-between text-green-400"><span>{t.checkout_page.discount} ({appliedDiscount?.code})</span><span>−{formatPrice(discountAmount())}</span></div>}
          {voucherAmount() > 0 && <div className="flex justify-between text-green-400"><span>{t.checkout_page.voucher}</span><span>−{formatPrice(voucherAmount())}</span></div>}
          {loyaltyPointsToRedeem > 0 && <div className="flex justify-between text-green-400"><span>{t.checkout_page.points} ({loyaltyPointsToRedeem} {t.checkout_page.points_unit})</span><span>−{formatPrice(loyaltyPointsToRedeem / 100)}</span></div>}
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-base"><span>{t.checkout_page.total}</span><span>{formatPrice(total())}</span></div>
        </div>
      </div>
    </main>
  )
}
