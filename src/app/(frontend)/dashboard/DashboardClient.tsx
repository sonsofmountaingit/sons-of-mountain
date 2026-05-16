'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

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
  mediaCount: number
  ratingsCount: number
  hasConfirmedRegistration: boolean
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

export function DashboardClient({ name, email, registrations, orders, vouchers, mediaCount, ratingsCount, hasConfirmedRegistration }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={gridRef} className="px-6 lg:px-10 py-10 max-w-4xl pb-24 lg:pb-10">
      <div className="mb-10">
        <p className="text-xs tracking-widest text-white/30 uppercase mb-1">Добре дошъл</p>
        <h1 className="text-3xl font-light tracking-wider">{name || email}</h1>
        <p className="text-sm text-white/40 mt-1">{email}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        <StatCard label="Регистрации" value={registrations.length} href="/dashboard/registrations" />
        <StatCard label="Поръчки" value={orders.length} href="/dashboard/orders" />
        <StatCard label="Ваучери" value={vouchers.length} href="/dashboard/vouchers" />
        <StatCard label="Медия" value={mediaCount} href="/dashboard/media" accent />
        <StatCard label="Оценки" value={ratingsCount} href="/dashboard/ratings" accent />
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {hasConfirmedRegistration ? (
          <>
            <QuickCard
              href="/dashboard/media"
              title="Сподели спомени"
              desc="Качи снимки и видеа от твоите пътувания. Те ще бъдат видими в галерията ни след одобрение."
              cta="КАЧИ МЕДИЯ →"
            />
            <QuickCard
              href="/dashboard/ratings"
              title="Оцени пътуванията си"
              desc="Помогни на другите с честна оценка на дестинациите и програмите, в които си участвал."
              cta="ДОБАВИ ОЦЕНКА →"
            />
          </>
        ) : (
          <div className="sm:col-span-2 border border-white/10 rounded-sm p-6">
            <p className="text-xs tracking-widest text-white/30 uppercase mb-2">Отключи повече функции</p>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Регистрирай се за дестинация, пътуване или индивидуална програма — след потвърждение ще можеш да качваш снимки, видеа и да оставяш оценки.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="/destinations" className="text-xs tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors px-4 py-2 rounded-sm">ДЕСТИНАЦИИ</a>
              <a href="/calendar" className="text-xs tracking-widest bg-white text-black hover:bg-white/90 transition-colors px-4 py-2 rounded-sm">КАЛЕНДАР</a>
            </div>
          </div>
        )}
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

function StatCard({ label, value, href, accent }: { label: string; value: number; href: string; accent?: boolean }) {
  return (
    <Link
      href={href}
      className={[
        'dash-card block border rounded-sm p-5 transition-colors group',
        accent
          ? 'border-white/20 hover:border-white/40 hover:bg-white/5'
          : 'border-white/10 hover:border-white/20',
      ].join(' ')}
    >
      <p className="text-3xl font-light">{value}</p>
      <p className={[
        'text-xs tracking-widest mt-1 transition-colors',
        accent ? 'text-white/60 group-hover:text-white' : 'text-white/40 group-hover:text-white/60',
      ].join(' ')}>
        {label.toUpperCase()}
      </p>
    </Link>
  )
}

function QuickCard({ href, title, desc, cta }: { href: string; title: string; desc: string; cta: string }) {
  return (
    <Link
      href={href}
      className="dash-card block border border-white/10 rounded-sm p-6 hover:border-white/25 hover:bg-white/3 transition-all group"
    >
      <h2 className="text-sm font-medium text-white/80 mb-2 group-hover:text-white transition-colors">{title}</h2>
      <p className="text-xs text-white/40 leading-relaxed mb-4">{desc}</p>
      <span className="text-xs tracking-widest text-white/50 group-hover:text-white transition-colors">{cta}</span>
    </Link>
  )
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="dash-card mb-6">
      <div className="flex items-center justify-between mb-3">
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
