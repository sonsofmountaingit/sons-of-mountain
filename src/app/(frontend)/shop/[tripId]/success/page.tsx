import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Booking successful!' }

export default function SuccessPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Booking successful!</h1>
        <p className="text-white/50 mb-8">You'll receive a confirmation email. We can't wait to travel together!</p>
        <Link href="/destinations" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90">
          View more destinations
        </Link>
      </div>
    </div>
  )
}
