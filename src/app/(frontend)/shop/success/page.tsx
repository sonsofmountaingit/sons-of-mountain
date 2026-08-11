import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatPrice } from '@/lib/currency'
import { PurchaseTracker } from '@/components/analytics/PurchaseTracker'
import { reconcileCheckoutSession } from '@/lib/cron/reconcile-checkout-payments'

export const metadata: Metadata = {
  title: 'Поръчката е потвърдена — Sons of Mountains',
  robots: { index: false, follow: false },
}

function itemTitle(item: any): string {
  return (
    item.trip?.title ??
    item.product?.title ??
    item.program?.title ??
    item.destination?.name ??
    item.bundle?.title ??
    'Продукт'
  )
}

async function getOrder(sessionId: string) {
  const payload = await getPayload({ config })

  const orders = await payload.find({
    collection: 'orders',
    where: { stripeSessionId: { equals: sessionId } },
    depth: 2,
    limit: 1,
  })
  if (orders.docs[0]) return { type: 'order' as const, doc: orders.docs[0] as any }

  const registrations = await payload.find({
    collection: 'registrations',
    where: { stripeSessionId: { equals: sessionId } },
    depth: 2,
    limit: 1,
  })
  if (registrations.docs[0]) return { type: 'registration' as const, doc: registrations.docs[0] as any }

  return null
}

async function SuccessContent({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  // Do not wait for asynchronous webhook delivery before showing a completed
  // purchase: verify the Stripe session and persist its paid state on redirect.
  if (session_id) {
    await reconcileCheckoutSession(session_id).catch((error) => {
      console.error('Failed to reconcile Checkout session on success page:', error)
    })
  }
  const result = session_id ? await getOrder(session_id) : null
  const doc = result?.doc

  const items = result?.type === 'order' ? ((doc?.items ?? []) as any[]) : null
  const orderNumber = doc?.id ? String(doc.id).slice(-8).toUpperCase() : null
  const total = doc?.totalAmount ?? doc?.amount ?? doc?.price ?? null
  const currency = doc?.currency ?? 'EUR'
  const email = doc?.email
  const paymentMode = doc?.paymentMode
  const depositPaid = doc?.depositPaid
  const remainingBalance = doc?.remainingBalance
  const remainingDueDate = doc?.remainingDueDate
  const installments = (doc?.installments ?? []) as any[]
  const nextInstallment = installments.find((row) => row.status === 'pending')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-6 mb-6">
        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Готово, резервацията е потвърдена!</h1>
      <p className="text-white/60 max-w-sm mb-10 text-sm">
        {email ? `Изпратихме потвърждение на ${email}.` : 'Проверете имейла си за потвърждение и следващи стъпки.'}
      </p>

      {doc && orderNumber && total != null && (
        <PurchaseTracker
          transactionId={orderNumber}
          value={total}
          currency={currency}
          items={(items ?? []).map((item) => ({
            item_id: String(item.trip?.id ?? item.product?.id ?? item.program?.id ?? item.destination?.id ?? item.bundle?.id ?? item.id ?? orderNumber),
            item_name: itemTitle(item),
            price: item.unitPrice ?? 0,
            quantity: item.quantity ?? item.participantCount ?? 1,
          }))}
        />
      )}

      {doc && (
        <div className="w-full max-w-md rounded border border-white/10 bg-white/5 p-6 mb-10 text-left">
          {orderNumber && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/40">Номер на поръчка</span>
              <span className="text-sm font-mono text-white">{orderNumber}</span>
            </div>
          )}

          {items && items.length > 0 && (
            <div className="space-y-3 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{itemTitle(item)}</p>
                    <p className="text-xs text-white/40">Кол: {item.quantity ?? item.participantCount ?? 1}</p>
                  </div>
                  {item.unitPrice != null && (
                    <span className="text-sm text-white/80">
                      {formatPrice((item.unitPrice ?? 0) * (item.quantity ?? 1))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {total != null && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm font-semibold text-white">Общо</span>
              <span className="text-sm font-semibold text-white">{formatPrice(total)} {currency !== 'EUR' ? currency : ''}</span>
            </div>
          )}

          {paymentMode === 'deposit' && remainingBalance != null && (
            <div className="mt-4 rounded border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Следващо плащане</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Остатък</span>
                <span className="text-sm font-semibold text-white">{formatPrice(remainingBalance)}</span>
              </div>
              {remainingDueDate && (
                <p className="text-xs text-white/40 mt-2">
                  Ще бъде изтеглен автоматично на {new Date(remainingDueDate).toLocaleDateString('bg-BG')} — ще получите напомняне по имейл.
                </p>
              )}
              {depositPaid != null && (
                <p className="text-xs text-white/40 mt-1">Платен депозит: {formatPrice(depositPaid)}</p>
              )}
            </div>
          )}
          {paymentMode === 'installments' && nextInstallment && (
            <div className="mt-4 rounded border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Следваща вноска</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{nextInstallment.label}</span>
                <span className="text-sm font-semibold text-white">{formatPrice(nextInstallment.amount)}</span>
              </div>
              {nextInstallment.dueDate && (
                <p className="text-xs text-white/40 mt-2">
                  Ще бъде изтеглена автоматично на {new Date(nextInstallment.dueDate).toLocaleDateString('bg-BG')} — ще получите напомняне по имейл.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/orders" className="rounded bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">
          Виж моите поръчки
        </Link>
        <Link href="/shop" className="rounded border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors">
          Продължи разглеждането
        </Link>
      </div>
    </main>
  )
}

export default function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  return (
    <Suspense>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  )
}
