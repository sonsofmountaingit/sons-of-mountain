import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Order Confirmed — Sons of Mountains' }

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  await searchParams
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-green-100 p-6 mb-6">
        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">You are booked!</h1>
      <p className="text-gray-500 max-w-sm mb-8">Your order is confirmed. Check your email for details and next steps.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/shop/orders" className="rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700">
          View my orders
        </Link>
        <Link href="/shop" className="rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Continue shopping
        </Link>
      </div>
    </main>
  )
}
