import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Катамарани — NoLimit Festival' }

export default function NolimitCatamaransPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Катамарани</h1>
        <p className="text-white/50 mb-12">Нашият флот за 2026</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Катамаран {n}</h3>
              <p className="text-sm text-white/50 mb-4">Луксозен катамаран за 8-10 човека с пълно обслужване.</p>
              <div className="space-y-1 text-xs text-white/40">
                <p>Дължина: 15м</p>
                <p>Кабини: 4</p>
                <p>Максимум: 10 гости</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
