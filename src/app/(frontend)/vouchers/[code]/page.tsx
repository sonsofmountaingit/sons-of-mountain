import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Your Gift Voucher — Sons of Mountains',
  robots: { index: false },
}

async function getVoucher(code: string) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { code: { equals: code.toUpperCase() } },
      limit: 1,
      depth: 0,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

async function VoucherContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const voucher = await getVoucher(code) as any
  if (!voucher) notFound()

  const isExpired = voucher.expiresAt && new Date(voucher.expiresAt) < new Date()
  const isActive = voucher.status === 'active' && !isExpired

  const statusLabel = isExpired ? 'Expired'
    : voucher.status === 'redeemed' ? 'Redeemed'
    : voucher.status === 'cancelled' ? 'Cancelled'
    : 'Active'

  const statusColor = isActive ? '#4ade80' : '#555'

  const expiryText = voucher.expiresAt
    ? new Date(voucher.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4">Sons of Mountains</p>
          <h1 className="text-3xl font-light tracking-wide">Adventure Voucher</h1>
        </div>

        <div className="border border-white/10 rounded-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-10 text-center">
            <p className="text-xs tracking-widest text-white/30 uppercase mb-3">Value</p>
            <p className="text-6xl font-light text-white mb-2">€{voucher.amount}</p>
            <p className="text-xs text-white/30">{voucher.currency}</p>

            <div className="mt-8 inline-block bg-black border border-white/10 rounded-sm px-6 py-3">
              <p className="text-xs tracking-widest text-white/30 uppercase mb-1">Voucher code</p>
              <p className="font-mono text-xl tracking-[0.3em] text-white">{voucher.code}</p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: statusColor }}>{statusLabel}</p>
            </div>
          </div>

          <div className="border-t border-white/10 divide-y divide-white/5">
            {voucher.recipientName && (
              <div className="flex justify-between px-6 py-4 text-sm">
                <span className="text-white/40">For</span>
                <span className="text-white/80">{voucher.recipientName}</span>
              </div>
            )}
            {voucher.senderName && (
              <div className="flex justify-between px-6 py-4 text-sm">
                <span className="text-white/40">From</span>
                <span className="text-white/80">{voucher.senderName}</span>
              </div>
            )}
            {expiryText && (
              <div className="flex justify-between px-6 py-4 text-sm">
                <span className="text-white/40">Valid until</span>
                <span className="text-white/50">{expiryText}</span>
              </div>
            )}
            {voucher.message && (
              <div className="px-6 py-4">
                <p className="text-xs tracking-widest text-white/30 uppercase mb-2">Message</p>
                <p className="text-sm text-white/60 italic leading-relaxed">"{voucher.message}"</p>
              </div>
            )}
          </div>
        </div>

        {isActive && (
          <div className="space-y-3">
            <Link
              href="/shop"
              className="block w-full py-3.5 text-center text-xs tracking-widest uppercase bg-white text-black hover:bg-white/90 transition-colors rounded-sm"
            >
              Browse Adventures
            </Link>
            <Link
              href="/vouchers?tab=redeem"
              className="block w-full py-3.5 text-center text-xs tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors rounded-sm"
            >
              Redeem This Code
            </Link>
          </div>
        )}

        {!isActive && (
          <p className="text-center text-xs text-white/30">
            This voucher has been {statusLabel.toLowerCase()}.
          </p>
        )}

        <p className="text-center text-xs text-white/20 mt-8">
          Use code <span className="font-mono tracking-wider text-white/40">{voucher.code}</span> at checkout
        </p>
      </div>
    </main>
  )
}

export default function VoucherViewPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense>
      <VoucherContent params={params} />
    </Suspense>
  )
}
