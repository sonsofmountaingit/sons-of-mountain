import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Регистрация — Sons of Mountains',
  description: 'Създай акаунт и открий своите следващи приключения.',
  robots: { index: false },
}

const SignupClient = dynamic(() => import('./SignupClient').then((m) => m.SignupClient), {
  loading: () => <div className="w-full max-w-md mx-auto h-72 bg-white/5 rounded-sm animate-pulse" />,
})

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">Регистрация</h1>
        <p className="mt-2 text-xs text-white/40 tracking-wider">Sons of Mountains</p>
      </div>
      <SignupClient />
    </main>
  )
}
