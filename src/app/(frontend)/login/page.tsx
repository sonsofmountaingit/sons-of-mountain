import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
import { translations, type Language } from '@/lib/translations'

export const metadata: Metadata = {
  title: 'Sign In — Sons of Mountains',
  description: 'Sign in to your account and manage your adventures.',
  robots: { index: false },
}

const LoginClient = dynamic(() => import('./LoginClient').then((m) => m.LoginClient), {
  loading: () => <div className="w-full max-w-md mx-auto h-64 bg-white/5 rounded-sm animate-pulse" />,
})

export default async function LoginPage() {
  const cookieStore = await cookies()
  const stored = cookieStore.get('language')?.value as Language | undefined
  const language: Language = stored === 'BG' || stored === 'EN' ? stored : 'BG'
  const t = translations[language]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-2xl font-light tracking-widest text-white uppercase">{t.auth.login}</h1>
        <p className="mt-2 text-xs text-white/40 tracking-wider">Sons of Mountains</p>
      </div>
      <LoginClient />
    </div>
  )
}
