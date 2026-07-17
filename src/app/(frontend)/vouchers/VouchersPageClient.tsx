'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from '@/lib/auth-client'
import { AuthModal } from '@/components/auth/AuthModal'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/currency'

interface Voucher {
  id: string
  code: string
  amount: number
  currency: string
  status: string
  recipientName?: string
  recipientEmail?: string
  expiresAt?: string
  message?: string
  isGift?: boolean
}

export const VOUCHERS_DEFAULTS = {
  eyebrow: 'Sons of Mountains',
  heading: 'Gift Vouchers',
  subtext: 'Give the gift of adventure — or treat yourself. Redeemable on any trip, program, or product.',
  buyTabLabel: 'Buy a Voucher',
  redeemTabLabel: 'Redeem',
  mineTabLabel: 'My Vouchers',
  forMyselfLabel: 'For myself',
  giftSomeoneLabel: 'Gift someone',
  chooseAmountLabel: 'Choose amount',
  amountPresets: [{ amount: 50 }, { amount: 100 }, { amount: 200 }, { amount: 300 }, { amount: 500 }],
  customAmountLabel: 'Custom',
  customAmountPlaceholder: 'Enter amount (€)',
  minAmount: 10,
  maxAmount: 5000,
  minAmountError: 'Minimum €10',
  maxAmountError: 'Maximum €5000',
  forSpecificLabel: 'For a specific',
  openTypeLabel: 'Any adventure',
  destinationTypeLabel: 'Destination',
  tripTypeLabel: 'Trip',
  programTypeLabel: 'Program',
  selectDestinationLabel: 'Select destination',
  selectTripLabel: 'Select trip',
  selectProgramLabel: 'Select program',
  selectedProgramPrefix: 'This voucher is for',
  recipientDetailsLabel: 'Recipient details',
  recipientNamePlaceholder: 'Recipient name',
  recipientEmailPlaceholder: 'Recipient email',
  recipientNameRequiredError: 'Required',
  recipientEmailInvalidError: 'Invalid email',
  personalMessageLabel: 'Personal message',
  giftMessagePlaceholder: 'Write a personal message for the recipient (optional)',
  selfMessagePlaceholder: 'A note for this voucher (optional)',
  scheduleDeliveryLabel: 'Schedule delivery',
  signedInAsPrefix: 'Signed in as',
  signInPromptText: "You'll be asked to sign in or create an account before checkout.",
  submitLoadingLabel: 'Redirecting...',
  submitButtonPrefix: 'Purchase',
  submitButtonSuffix: 'Voucher',
  voucherCreateError: 'Failed to create voucher',
  genericError: 'Something went wrong',
  giftDescriptionPrefix: 'Gift Voucher for',
  selfDescriptionPrefix: 'Adventure Voucher —',
  redeemPromptLabel: 'Enter your voucher code',
  redeemCodePlaceholder: 'SOM-XXXX-XXXX',
  redeemButtonLabel: 'Redeem Voucher',
  redeemLoadingLabel: '...',
  redeemSuccessPrefix: 'Voucher redeemed! Value:',
  redeemGenericError: 'Something went wrong',
  redeemSignInPrefix: 'Sign in',
  redeemSignInSuffix: 'to redeem a voucher.',
  mineSignInPrompt: 'Sign in to view your vouchers.',
  mineSignInButtonLabel: 'Sign In',
  mineEmptyLabel: 'No vouchers yet.',
  mineGiftBadgeLabel: 'Gift',
  mineForPrefix: 'For:',
  mineExpiresPrefix: 'Expires',
  statusActiveLabel: 'Active',
  statusRedeemedLabel: 'Redeemed',
  statusExpiredLabel: 'Expired',
  statusCancelledLabel: 'Cancelled',
}

export type VouchersContent = typeof VOUCHERS_DEFAULTS

interface ProgramGroupItem {
  id: string
  title: string
  kind: 'trip' | 'program'
  price?: number
  currency?: string
  earlyBirdPrice?: number
  earlyBirdUntil?: string
}

function isEarlyBirdActive(item: ProgramGroupItem) {
  if (!item.earlyBirdPrice) return false
  if (!item.earlyBirdUntil) return true
  return new Date(item.earlyBirdUntil).getTime() > Date.now()
}

function formatItemPrice(item: ProgramGroupItem) {
  if (item.price == null) return ''
  const currency = item.currency ?? 'EUR'
  if (isEarlyBirdActive(item)) {
    return `Early bird: ${item.earlyBirdPrice} ${currency} (${item.price} ${currency})`
  }
  return `${item.price} ${currency}`
}

interface ProgramGroup {
  id: string
  label: string
  items: ProgramGroupItem[]
}

interface Props {
  destinations: any[]
  trips: any[]
  programs: any[]
  programGroups: ProgramGroup[]
  myVouchers: Voucher[]
  content?: Partial<VouchersContent>
}

const baseSchema = {
  amount: z.number(),
  voucherType: z.enum(['open', 'destination', 'trip', 'program']),
  destinationId: z.string().optional(),
  tripId: z.string().optional(),
  programId: z.string().optional(),
  message: z.string().optional(),
  deliveryDate: z.string().optional(),
}

const selfSchema = z.object({ ...baseSchema, isGift: z.literal(false) })

const giftSchema = z.object({
  ...baseSchema,
  isGift: z.literal(true),
  recipientName: z.string().min(1),
  recipientEmail: z.string().email(),
})

const schema = z.discriminatedUnion('isGift', [selfSchema, giftSchema])
type FormData = z.infer<typeof schema>

export function VouchersPageClient({ destinations, trips, programs, programGroups, myVouchers: initialVouchers, content }: Props) {
  const c: VouchersContent = { ...VOUCHERS_DEFAULTS, ...content }
  const { data: sessionData } = useSession()
  const session = sessionData?.user ?? null
  const [tab, setTab] = useState<'buy' | 'redeem' | 'mine'>('buy')
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [tab])

  function refreshVouchers() {
    fetch('/api/voucher/mine')
      .then((r) => r.json())
      .then((data) => { if (data.vouchers) setVouchers(data.vouchers) })
      .catch(() => {})
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        <div className="mb-16 text-center">
          <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4">{c.eyebrow}</p>
          <h1 className="text-4xl font-light tracking-wide">{c.heading}</h1>
          <p className="mt-4 text-white/40 max-w-md mx-auto text-sm leading-relaxed">
            {c.subtext}
          </p>
        </div>

        <div className="flex gap-0 border border-white/10 rounded-sm mb-12 overflow-hidden">
          {([['buy', c.buyTabLabel], ['redeem', c.redeemTabLabel], ['mine', c.mineTabLabel]] as const).map(([id, label]) => (
            <button
              key={id}
              data-tab={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 text-xs tracking-widest uppercase transition-colors ${
                tab === id ? 'bg-white text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div ref={contentRef}>
          {tab === 'buy' && (
            <BuyTab
              destinations={destinations}
              programGroups={programGroups}
              session={session}
              onPurchased={refreshVouchers}
              c={c}
            />
          )}
          {tab === 'redeem' && <RedeemTab session={session} c={c} />}
          {tab === 'mine' && <MineTab vouchers={vouchers} session={session} c={c} />}
        </div>
      </div>
    </main>
  )
}

function BuyTab({
  destinations, programGroups, session, onPurchased, c,
}: {
  destinations: any[]
  programGroups: ProgramGroup[]
  session: any
  onPurchased: () => void
  c: VouchersContent
}) {
  const [loading, setLoading] = useState(false)
  const [customAmount, setCustomAmount] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState<FormData | null>(null)
  const [authedUser, setAuthedUser] = useState<{ id: string; name: string; email: string } | null>(
    session ? { id: session.id, name: session.name ?? '', email: session.email } : null,
  )

  const amounts = c.amountPresets.map((p) => p.amount)

  const dynamicSchema = z.discriminatedUnion('isGift', [
    z.object({ ...baseSchema, amount: z.number().min(c.minAmount, c.minAmountError).max(c.maxAmount, c.maxAmountError), isGift: z.literal(false) }),
    z.object({ ...baseSchema, amount: z.number().min(c.minAmount, c.minAmountError).max(c.maxAmount, c.maxAmountError), isGift: z.literal(true), recipientName: z.string().min(1, c.recipientNameRequiredError), recipientEmail: z.string().email(c.recipientEmailInvalidError) }),
  ])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: { isGift: false, voucherType: 'open', amount: amounts[1] ?? amounts[0] ?? 100 },
  })

  const isGift = watch('isGift')
  const voucherType = watch('voucherType')
  const amount = watch('amount')
  const tripId = watch('tripId')
  const programId = watch('programId')
  const selectedProgram = programGroups
    .flatMap((g) => g.items)
    .find((i) => (i.kind === 'program' ? i.id === programId : i.id === tripId))

  function onProgramSelectChange(value: string) {
    if (!value) {
      setValue('tripId', undefined)
      setValue('programId', undefined)
      return
    }
    const [kind, id] = value.split(':')
    setValue('tripId', kind === 'trip' ? id : undefined)
    setValue('programId', kind === 'program' ? id : undefined)
  }

  async function proceed(data: FormData, user: { id: string; name: string; email: string }) {
    setLoading(true)
    try {
      const recipientName = data.isGift ? data.recipientName : user.name
      const recipientEmail = data.isGift ? data.recipientEmail : user.email

      const voucherRes = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          recipientEmail,
          senderName: user.name,
          senderEmail: user.email,
          amount: data.amount,
          currency: 'EUR',
          message: data.message,
          forDestination: data.destinationId || undefined,
          forTrip: data.tripId || undefined,
          forProgram: data.programId || undefined,
          isGift: data.isGift,
        }),
      })

      if (!voucherRes.ok) {
        const err = await voucherRes.json()
        toast.error(err.error ?? c.voucherCreateError)
        setLoading(false)
        return
      }

      const { voucherId } = await voucherRes.json()

      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'voucher',
          recordId: voucherId,
          amount: data.amount,
          currency: 'eur',
          description: data.isGift
            ? `${c.giftDescriptionPrefix} ${recipientName}`
            : `${c.selfDescriptionPrefix} ${formatPrice(data.amount)}`,
          customerEmail: user.email,
          successPath: '/vouchers?tab=mine&success=1',
          cancelPath: '/vouchers',
        }),
      })

      const { url } = await checkoutRes.json()
      if (url) window.location.href = url
    } catch {
      toast.error(c.genericError)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: FormData) {
    const user = authedUser ?? (session ? { id: session.id, name: session.name ?? '', email: session.email } : null)
    if (!user) {
      setPendingSubmit(data)
      setShowAuth(true)
      return
    }
    await proceed(data, user)
  }

  function onAuthSuccess(user: { id: string; name: string; email: string }) {
    setAuthedUser(user)
    setShowAuth(false)
    if (pendingSubmit) {
      proceed(pendingSubmit, user)
      setPendingSubmit(null)
    }
  }

  const typeLabels: Record<string, string> = {
    open: c.openTypeLabel,
    destination: c.destinationTypeLabel,
    trip: c.tripTypeLabel,
    program: c.programTypeLabel,
  }

  return (
    <>
      {showAuth && <AuthModal onSuccess={onAuthSuccess} onClose={() => setShowAuth(false)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="flex gap-0 border border-white/10 rounded-sm overflow-hidden max-w-xs">
          <button
            type="button"
            onClick={() => setValue('isGift', false as any)}
            className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${!isGift ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            {c.forMyselfLabel}
          </button>
          <button
            type="button"
            onClick={() => setValue('isGift', true as any)}
            className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${isGift ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            {c.giftSomeoneLabel}
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-widest text-white/30 uppercase mb-6">{c.chooseAmountLabel}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {amounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setValue('amount', a); setCustomAmount(false) }}
                  className={`py-3 text-sm border transition-colors rounded-sm ${
                    amount === a && !customAmount
                      ? 'border-white text-white bg-white/5'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {formatPrice(a)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomAmount(true)}
                className={`py-3 text-sm border transition-colors rounded-sm ${
                  customAmount ? 'border-white text-white bg-white/5' : 'border-white/10 text-white/50 hover:border-white/30'
                }`}
              >
                {c.customAmountLabel}
              </button>
            </div>
            {customAmount && (
              <div className="mb-4">
                <input
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder={c.customAmountPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
                />
                {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
              </div>
            )}

            <p className="text-xs tracking-widest text-white/30 uppercase mb-4 mt-8">{c.forSpecificLabel}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {(['open', 'destination', 'program'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setValue('voucherType', t)}
                  className={`px-4 py-2 text-xs border rounded-sm transition-colors capitalize ${
                    voucherType === t ? 'border-white text-white bg-white/5' : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>
            {voucherType === 'destination' && (
              <select {...register('destinationId')} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors">
                <option value="">{c.selectDestinationLabel}</option>
                {destinations.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}
            {voucherType === 'program' && (
              <>
                <select
                  value={programId ? `program:${programId}` : tripId ? `trip:${tripId}` : ''}
                  onChange={(e) => onProgramSelectChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors"
                >
                  <option value="">{c.selectProgramLabel}</option>
                  {programGroups.map((group) => (
                    <optgroup key={group.id} label={group.label}>
                      {group.items.map((item) => (
                        <option key={`${item.kind}:${item.id}`} value={`${item.kind}:${item.id}`}>
                          {item.title}{formatItemPrice(item) ? ` — ${formatItemPrice(item)}` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {selectedProgram && (
                  <p className="text-xs text-white/40 mt-2">
                    {c.selectedProgramPrefix} <span className="text-white/70">{selectedProgram.title}</span>
                    {formatItemPrice(selectedProgram) && <span className="text-white/50"> — {formatItemPrice(selectedProgram)}</span>}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-4">
            {isGift && (
              <>
                <p className="text-xs tracking-widest text-white/30 uppercase">{c.recipientDetailsLabel}</p>
                <div>
                  <input
                    {...register('recipientName')}
                    placeholder={c.recipientNamePlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
                  />
                  {'recipientName' in errors && errors.recipientName && (
                    <p className="text-xs text-red-400 mt-1">{(errors as any).recipientName.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('recipientEmail')}
                    type="email"
                    placeholder={c.recipientEmailPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
                  />
                  {'recipientEmail' in errors && errors.recipientEmail && (
                    <p className="text-xs text-red-400 mt-1">{(errors as any).recipientEmail.message}</p>
                  )}
                </div>
              </>
            )}

            <p className="text-xs tracking-widest text-white/30 uppercase pt-2">{c.personalMessageLabel}</p>
            <textarea
              {...register('message')}
              placeholder={isGift ? c.giftMessagePlaceholder : c.selfMessagePlaceholder}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors resize-none"
            />

            {isGift && (
              <div>
                <label className="text-xs text-white/30 mb-1 block tracking-widest uppercase">{c.scheduleDeliveryLabel}</label>
                <input
                  {...register('deliveryDate')}
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors"
                />
              </div>
            )}

            {authedUser || session ? (
              <div className="flex items-center gap-2 py-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-xs text-white/40">
                  {c.signedInAsPrefix} <span className="text-white/70">{(authedUser ?? session)?.email}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-white/30 pt-1">
                {c.signInPromptText}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs tracking-widest uppercase border border-white text-white hover:bg-white hover:text-black transition-colors rounded-sm disabled:opacity-40"
            >
              {loading ? c.submitLoadingLabel : `${c.submitButtonPrefix} ${amount ? formatPrice(amount) : '—'} ${c.submitButtonSuffix}`}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

function RedeemTab({ session, c }: { session: any; c: VouchersContent }) {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  async function redeem(e: React.FormEvent) {
    e.preventDefault()
    if (!session) { setShowAuth(true); return }
    setLoading(true)
    setMsg(null)
    const res = await fetch(`/api/voucher?code=${encodeURIComponent(code)}`)
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setMsg({ text: `${c.redeemSuccessPrefix} ${formatPrice(data.voucher?.amount)}`, ok: true })
      setCode('')
    } else {
      setMsg({ text: data.error ?? c.redeemGenericError, ok: false })
    }
  }

  return (
    <>
      {showAuth && <AuthModal onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />}
      <div className="max-w-md mx-auto">
        <p className="text-xs tracking-widest text-white/30 uppercase mb-6">{c.redeemPromptLabel}</p>
        <form onSubmit={redeem} className="space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={c.redeemCodePlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors tracking-wider"
          />
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full py-3.5 text-xs tracking-widest uppercase border border-white text-white hover:bg-white hover:text-black transition-colors rounded-sm disabled:opacity-40"
          >
            {loading ? c.redeemLoadingLabel : c.redeemButtonLabel}
          </button>
        </form>
        {msg && <p className={`mt-4 text-sm ${msg.ok ? 'text-green-400' : 'text-red-400'}`}>{msg.text}</p>}
        {!session && (
          <p className="mt-6 text-xs text-white/30 text-center">
            <button onClick={() => setShowAuth(true)} className="underline hover:text-white transition-colors">{c.redeemSignInPrefix}</button> {c.redeemSignInSuffix}
          </p>
        )}
      </div>
    </>
  )
}

function MineTab({ vouchers, session, c }: { vouchers: Voucher[]; session: any; c: VouchersContent }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [showAuth, setShowAuth] = useState(false)

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: c.statusActiveLabel, color: 'text-green-400' },
    redeemed: { label: c.statusRedeemedLabel, color: 'text-white/30' },
    expired: { label: c.statusExpiredLabel, color: 'text-white/30' },
    cancelled: { label: c.statusCancelledLabel, color: 'text-red-400' },
  }

  useEffect(() => {
    if (!listRef.current || !vouchers.length) return
    const rows = listRef.current.querySelectorAll('.v-row')
    const ctx = gsap.context(() => {
      gsap.fromTo(rows, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: 'power2.out' })
    }, listRef)
    return () => ctx.revert()
  }, [vouchers.length])

  if (!session) {
    return (
      <>
        {showAuth && <AuthModal onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />}
        <div className="text-center py-16">
          <p className="text-white/40 text-sm mb-6">{c.mineSignInPrompt}</p>
          <button
            onClick={() => setShowAuth(true)}
            className="text-xs tracking-widest uppercase border border-white/30 px-6 py-3 text-white/70 hover:text-white hover:border-white transition-colors rounded-sm"
          >
            {c.mineSignInButtonLabel}
          </button>
        </div>
      </>
    )
  }

  if (!vouchers.length) {
    return (
      <div className="text-center py-16">
        <p className="text-white/30 text-sm">{c.mineEmptyLabel}</p>
      </div>
    )
  }

  return (
    <div ref={listRef} className="space-y-3">
      {vouchers.map((v) => {
        const { label, color } = statusMap[v.status] ?? { label: v.status, color: 'text-white/40' }
        return (
          <div key={v.id} className="v-row border border-white/10 rounded-sm p-5 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-mono text-sm text-white/90 tracking-wider">{v.code}</p>
                  {v.isGift && (
                    <span className="text-[10px] tracking-widest uppercase border border-amber-700/50 text-amber-400/80 px-2 py-0.5 rounded-sm">{c.mineGiftBadgeLabel}</span>
                  )}
                </div>
                {v.recipientName && (
                  <p className="text-xs text-white/40">{c.mineForPrefix} {v.recipientName} · {v.recipientEmail}</p>
                )}
                {v.message && (
                  <p className="text-xs text-white/30 mt-1 italic truncate max-w-xs">"{v.message}"</p>
                )}
                {v.expiresAt && (
                  <p className="text-xs text-white/20 mt-1">
                    {c.mineExpiresPrefix} {new Date(v.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs tracking-widest uppercase ${color}`}>{label}</p>
                <p className="text-lg font-light text-white mt-1">{formatPrice(v.amount)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
