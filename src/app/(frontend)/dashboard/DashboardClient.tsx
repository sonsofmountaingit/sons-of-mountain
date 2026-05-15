'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

interface Registration {
  id: string
  status: string
  totalAmount: number
  currency: string
  createdAt: string
  trip?: { title?: string } | null
  destination?: { title?: string } | null
}

interface Order {
  id: string
  status: string
  totalAmount: number
  currency: string
  createdAt: string
}

interface Voucher {
  id: string
  code: string
  amount: number
  currency: string
  status: string
  expiresAt?: string
}

interface Props {
  name: string
  email: string
  registrations: Registration[]
  orders: Order[]
  vouchers: Voucher[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Чакащ',
  confirmed: 'Потвърден',
  paid: 'Платен',
  cancelled: 'Отказан',
  refunded: 'Върнат',
  active: 'Активен',
  redeemed: 'Използван',
  expired: 'Изтекъл',
}

const STATUS_COLORS: Record<string, string> = {
  paid: 'text-green-400',
  confirmed: 'text-blue-400',
  active: 'text-green-400',
  pending: 'text-yellow-400',
  cancelled: 'text-red-400',
  refunded: 'text-orange-400',
  redeemed: 'text-white/30',
  expired: 'text-white/30',
}

export function DashboardClient({ name, email, registrations, orders, vouchers }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dash-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  return (
    <div ref={gridRef} className="min-h-screen bg-black text-white px-4 py-16 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-xs tracking-widest text-white/30 uppercase mb-1">Акаунт</p>
          <h1 className="text-2xl font-light tracking-wider">{name || email}</h1>
          <p className="text-sm text-white/40 mt-0.5">{email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/profile"
            className="text-xs tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors px-4 py-2 rounded-sm"
          >
            ПРОФИЛ
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs tracking-widest border border-white/20 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors px-4 py-2 rounded-sm"
          >
            ИЗХОД
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Регистрации" value={registrations.length} href="/dashboard/registrations" />
        <StatCard label="Поръчки" value={orders.length} href="/dashboard/orders" />
        <StatCard label="Ваучери" value={vouchers.length} href="/dashboard/vouchers" />
      </div>

      {registrations.length > 0 && (
        <Section title="Последни регистрации" href="/dashboard/registrations">
          {registrations.slice(0, 3).map((r) => (
            <RecordRow
              key={r.id}
              title={r.trip?.title ?? r.destination?.title ?? 'Регистрация'}
              status={r.status}
              amount={r.totalAmount}
              currency={r.currency}
              date={r.createdAt}
            />
          ))}
        </Section>
      )}

      {vouchers.length > 0 && (
        <Section title="Ваучери" href="/dashboard/vouchers">
          {vouchers.slice(0, 3).map((v) => (
            <RecordRow
              key={v.id}
              title={`Ваучер ${v.code}`}
              status={v.status}
              amount={v.amount}
              currency={v.currency}
              date={v.expiresAt ?? ''}
            />
          ))}
        </Section>
      )}
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="dash-card block border border-white/10 rounded-sm p-6 hover:border-white/20 transition-colors group">
      <p className="text-3xl font-light">{value}</p>
      <p className="text-xs tracking-widest text-white/40 mt-1 group-hover:text-white/60 transition-colors">{label.toUpperCase()}</p>
    </Link>
  )
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="dash-card mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs tracking-widest text-white/50 uppercase">{title}</h2>
        <Link href={href} className="text-xs text-white/30 hover:text-white/60 transition-colors">Виж всички →</Link>
      </div>
      <div className="border border-white/10 rounded-sm divide-y divide-white/5">{children}</div>
    </div>
  )
}

function RecordRow({ title, status, amount, currency, date }: { title: string; status: string; amount: number; currency: string; date: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm text-white/80">{title}</p>
        <p className="text-xs text-white/30 mt-0.5">{date ? new Date(date).toLocaleDateString('bg-BG') : ''}</p>
      </div>
      <div className="text-right">
        <p className={`text-xs tracking-widest ${STATUS_COLORS[status] ?? 'text-white/50'}`}>{STATUS_LABELS[status] ?? status}</p>
        <p className="text-sm text-white/60 mt-0.5">{amount} {currency}</p>
      </div>
    </div>
  )
}
