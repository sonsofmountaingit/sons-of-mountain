'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from '@/lib/auth-client'
import { AuthModal } from '@/components/auth/AuthModal'

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

interface Props {
  destinations: any[]
  trips: any[]
  programs: any[]
  myVouchers: Voucher[]
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-green-400' },
  redeemed: { label: 'Redeemed', color: 'text-white/30' },
  expired: { label: 'Expired', color: 'text-white/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400' },
}

const AMOUNTS = [50, 100, 200, 300, 500]

const baseSchema = {
  amount: z.number().min(10, 'Minimum €10').max(5000, 'Maximum €5000'),
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
  recipientName: z.string().min(1, 'Required'),
  recipientEmail: z.string().email('Invalid email'),
})

const schema = z.discriminatedUnion('isGift', [selfSchema, giftSchema])
type FormData = z.infer<typeof schema>

export function VouchersPageClient({ destinations, trips, programs, myVouchers: initialVouchers }: Props) {
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
          <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4">Sons of Mountains</p>
          <h1 className="text-4xl font-light tracking-wide">Gift Vouchers</h1>
          <p className="mt-4 text-white/40 max-w-md mx-auto text-sm leading-relaxed">
            Give the gift of adventure — or treat yourself. Redeemable on any trip, program, or product.
          </p>
        </div>

        <div className="flex gap-0 border border-white/10 rounded-sm mb-12 overflow-hidden">
          {([['buy', 'Buy a Voucher'], ['redeem', 'Redeem'], ['mine', 'My Vouchers']] as const).map(([id, label]) => (
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
              trips={trips}
              programs={programs}
              session={session}
              onPurchased={refreshVouchers}
            />
          )}
          {tab === 'redeem' && <RedeemTab session={session} />}
          {tab === 'mine' && <MineTab vouchers={vouchers} session={session} />}
        </div>
      </div>
    </main>
  )
}

function BuyTab({
  destinations, trips, programs, session, onPurchased,
}: {
  destinations: any[]
  trips: any[]
  programs: any[]
  session: any
  onPurchased: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [customAmount, setCustomAmount] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState<FormData | null>(null)
  const [authedUser, setAuthedUser] = useState<{ id: string; name: string; email: string } | null>(
    session ? { id: session.id, name: session.name ?? '', email: session.email } : null,
  )

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isGift: false, voucherType: 'open', amount: 100 },
  })

  const isGift = watch('isGift')
  const voucherType = watch('voucherType')
  const amount = watch('amount')

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
        alert(err.error ?? 'Failed to create voucher')
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
            ? `Gift Voucher for ${recipientName}`
            : `Adventure Voucher — €${data.amount}`,
          customerEmail: user.email,
          successPath: '/vouchers?tab=mine&success=1',
          cancelPath: '/vouchers',
        }),
      })

      const { url } = await checkoutRes.json()
      if (url) window.location.href = url
    } catch {
      alert('Something went wrong. Please try again.')
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
            For myself
          </button>
          <button
            type="button"
            onClick={() => setValue('isGift', true as any)}
            className={`flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors ${isGift ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            Gift someone
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-widest text-white/30 uppercase mb-6">Choose amount</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {AMOUNTS.map((a) => (
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
                  €{a}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomAmount(true)}
                className={`py-3 text-sm border transition-colors rounded-sm ${
                  customAmount ? 'border-white text-white bg-white/5' : 'border-white/10 text-white/50 hover:border-white/30'
                }`}
              >
                Custom
              </button>
            </div>
            {customAmount && (
              <div className="mb-4">
                <input
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="Enter amount (€)"
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
                />
                {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
              </div>
            )}

            <p className="text-xs tracking-widest text-white/30 uppercase mb-4 mt-8">For a specific</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {(['open', 'destination', 'trip', 'program'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setValue('voucherType', t)}
                  className={`px-4 py-2 text-xs border rounded-sm transition-colors capitalize ${
                    voucherType === t ? 'border-white text-white bg-white/5' : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {t === 'open' ? 'Any adventure' : t}
                </button>
              ))}
            </div>
            {voucherType === 'destination' && (
              <select {...register('destinationId')} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors">
                <option value="">Select destination</option>
                {destinations.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}
            {voucherType === 'trip' && (
              <select {...register('tripId')} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors">
                <option value="">Select trip</option>
                {trips.map((t: any) => <option key={t.id} value={t.id}>{t.title ?? t.id}</option>)}
              </select>
            )}
            {voucherType === 'program' && (
              <select {...register('programId')} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors">
                <option value="">Select program</option>
                {programs.map((p: any) => <option key={p.id} value={p.id}>{p.title ?? p.id}</option>)}
              </select>
            )}
          </div>

          <div className="space-y-4">
            {isGift && (
              <>
                <p className="text-xs tracking-widest text-white/30 uppercase">Recipient details</p>
                <div>
                  <input
                    {...register('recipientName')}
                    placeholder="Recipient name"
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
                    placeholder="Recipient email"
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
                  />
                  {'recipientEmail' in errors && errors.recipientEmail && (
                    <p className="text-xs text-red-400 mt-1">{(errors as any).recipientEmail.message}</p>
                  )}
                </div>
              </>
            )}

            <p className="text-xs tracking-widest text-white/30 uppercase pt-2">Personal message</p>
            <textarea
              {...register('message')}
              placeholder={isGift ? 'Write a personal message for the recipient (optional)' : 'A note for this voucher (optional)'}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors resize-none"
            />

            {isGift && (
              <div>
                <label className="text-xs text-white/30 mb-1 block tracking-widest uppercase">Schedule delivery</label>
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
                  Signed in as <span className="text-white/70">{(authedUser ?? session)?.email}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-white/30 pt-1">
                You'll be asked to sign in or create an account before checkout.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs tracking-widest uppercase border border-white text-white hover:bg-white hover:text-black transition-colors rounded-sm disabled:opacity-40"
            >
              {loading ? 'Redirecting...' : `Purchase €${amount || '—'} Voucher`}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

function RedeemTab({ session }: { session: any }) {
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
      setMsg({ text: `Voucher redeemed! Value: €${data.voucher?.amount} ${data.voucher?.currency}`, ok: true })
      setCode('')
    } else {
      setMsg({ text: data.error ?? 'Something went wrong', ok: false })
    }
  }

  return (
    <>
      {showAuth && <AuthModal onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />}
      <div className="max-w-md mx-auto">
        <p className="text-xs tracking-widest text-white/30 uppercase mb-6">Enter your voucher code</p>
        <form onSubmit={redeem} className="space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SOM-XXXX-XXXX"
            className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors tracking-wider"
          />
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full py-3.5 text-xs tracking-widest uppercase border border-white text-white hover:bg-white hover:text-black transition-colors rounded-sm disabled:opacity-40"
          >
            {loading ? '...' : 'Redeem Voucher'}
          </button>
        </form>
        {msg && <p className={`mt-4 text-sm ${msg.ok ? 'text-green-400' : 'text-red-400'}`}>{msg.text}</p>}
        {!session && (
          <p className="mt-6 text-xs text-white/30 text-center">
            <button onClick={() => setShowAuth(true)} className="underline hover:text-white transition-colors">Sign in</button> to redeem a voucher.
          </p>
        )}
      </div>
    </>
  )
}

function MineTab({ vouchers, session }: { vouchers: Voucher[]; session: any }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [showAuth, setShowAuth] = useState(false)

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
          <p className="text-white/40 text-sm mb-6">Sign in to view your vouchers.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="text-xs tracking-widest uppercase border border-white/30 px-6 py-3 text-white/70 hover:text-white hover:border-white transition-colors rounded-sm"
          >
            Sign In
          </button>
        </div>
      </>
    )
  }

  if (!vouchers.length) {
    return (
      <div className="text-center py-16">
        <p className="text-white/30 text-sm">No vouchers yet.</p>
      </div>
    )
  }

  return (
    <div ref={listRef} className="space-y-3">
      {vouchers.map((v) => {
        const { label, color } = STATUS_MAP[v.status] ?? { label: v.status, color: 'text-white/40' }
        return (
          <div key={v.id} className="v-row border border-white/10 rounded-sm p-5 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-mono text-sm text-white/90 tracking-wider">{v.code}</p>
                  {v.isGift && (
                    <span className="text-[10px] tracking-widest uppercase border border-amber-700/50 text-amber-400/80 px-2 py-0.5 rounded-sm">Gift</span>
                  )}
                </div>
                {v.recipientName && (
                  <p className="text-xs text-white/40">For: {v.recipientName} · {v.recipientEmail}</p>
                )}
                {v.message && (
                  <p className="text-xs text-white/30 mt-1 italic truncate max-w-xs">"{v.message}"</p>
                )}
                {v.expiresAt && (
                  <p className="text-xs text-white/20 mt-1">
                    Expires {new Date(v.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs tracking-widest uppercase ${color}`}>{label}</p>
                <p className="text-lg font-light text-white mt-1">€{v.amount}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
