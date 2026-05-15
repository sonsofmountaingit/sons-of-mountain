import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Потвърждаване на имейл — Sons of Mountains',
  robots: { index: false },
}

export default function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
  if (!searchParams.token) redirect('/login')

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-light tracking-widest text-white uppercase mb-4">Потвърждаване</h1>
      <p className="text-sm text-white/50">Имейлът ти беше потвърден успешно.</p>
      <a href="/dashboard" className="mt-8 text-xs tracking-widest border border-white/30 text-white/70 hover:text-white hover:border-white transition-colors px-6 py-3 rounded-sm">
        КЪМ АКАУНТА
      </a>
    </main>
  )
}
