import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Payment Cancelled — Sons of Mountains' }

export default function CancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-6">
        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
      <p className="text-gray-500 max-w-sm mb-8">No charge was made. Your cart items are still saved.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/shop/checkout" className="rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700">
          Try again
        </Link>
        <Link href="/shop" className="rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Browse shop
        </Link>
      </div>
    </main>
  )
}
