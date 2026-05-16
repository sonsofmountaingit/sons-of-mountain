import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Нова парола — Sons of Mountains',
  robots: { index: false },
}

const ResetClient = dynamic(() => import('./ResetClient').then((m) => m.ResetClient), {
  loading: () => <div className="w-full max-w-md mx-auto h-48 bg-white/5 rounded-sm animate-pulse" />,
})

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">Нова парола</h1>
      </div>
      <ResetClient />
    </div>
  )
}
