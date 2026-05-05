import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Общи условия' }

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
