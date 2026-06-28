import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика за бисквитки — Sons of Mountains',
  description: 'Политика за бисквитки на Sons of Mountains.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/legal/cookies` },
  robots: { index: true, follow: true },
}

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Политика за поверителност</h1>
        <div className="prose prose-invert max-w-none text-white/70">
          <p>Политиката за поверителност ще бъде добавена скоро.</p>
        </div>
      </div>
    </div>
  )
}
