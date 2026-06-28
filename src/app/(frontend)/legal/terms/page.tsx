import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Общи условия — Sons of Mountains',
  description: 'Общи условия за използване на Sons of Mountains.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/legal/terms` },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Общи условия</h1>
        <div className="prose prose-invert max-w-none text-white/70">
          <p>Съдържанието на общите условия ще бъде добавено скоро.</p>
        </div>
      </div>
    </div>
  )
}
