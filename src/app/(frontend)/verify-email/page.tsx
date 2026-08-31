import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Потвърждаване на имейл — Sons of Mountains',
  robots: { index: false },
}

export default function VerifyEmailPage({ searchParams }: { searchParams: { verified?: string; error?: string } }) {
  if (!searchParams.verified && !searchParams.error) redirect('/login')
  const verified = searchParams.verified === '1'

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-light tracking-widest text-white uppercase mb-4">{verified ? 'Имейлът е потвърден' : 'Потвърждаването неуспешно'}</h1>
      <p className="text-sm text-white/50">{verified ? 'Вече можеш да влезеш в профила си.' : 'Линкът е невалиден или е изтекъл. Поискай нов линк и опитай отново.'}</p>
      <a href="/login" className="mt-8 text-xs tracking-widest border border-white/30 text-white/70 hover:text-white hover:border-white transition-colors px-6 py-3 rounded-sm">
        {verified ? 'КЪМ ВХОД' : 'КЪМ ВХОД'}
      </a>
    </main>
  )
}
