import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Forgot Password — Sons of Mountains',
  robots: { index: false },
}

const ForgotClient = dynamic(() => import('./ForgotClient').then((m) => m.ForgotClient), {
  loading: () => <div className="w-full max-w-md mx-auto h-40 bg-white/5 rounded-sm animate-pulse" />,
})

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">Forgot Password</h1>
        <p className="mt-2 text-xs text-white/40 tracking-wider">We'll send a link to your email</p>
      </div>
      <ForgotClient />
    </div>
  )
}
