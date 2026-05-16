import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Вход — Sons of Mountains',
  description: 'Влез в своя акаунт и управлявай своите приключения.',
  robots: { index: false },
}

const LoginClient = dynamic(() => import('./LoginClient').then((m) => m.LoginClient), {
  loading: () => <div className="w-full max-w-md mx-auto h-64 bg-white/5 rounded-sm animate-pulse" />,
})

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">Вход</h1>
        <p className="mt-2 text-xs text-white/40 tracking-wider">Sons of Mountains</p>
      </div>
      <LoginClient />
    </div>
  )
}
