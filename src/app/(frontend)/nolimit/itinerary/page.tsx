import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Програма — NoLimit Festival' }

const DAYS = [
  { day: 1, title: 'Заминаване — Хургада', desc: 'Настаняване на яхтите, коктейлна вечер.' },
  { day: 2, title: 'Острови — Карамбиш', desc: 'Гмуркане, плаж, залез на борда.' },
  { day: 3, title: 'Остров Утайя', desc: 'Снорклинг, обяд на плажа, нощно парти.' },
  { day: 4, title: 'Свободен ден', desc: 'Риболов, SUP, релакс.' },
  { day: 5, title: 'Остров Ел Фанадир', desc: 'Скубадайвинг, барбекю.' },
  { day: 6, title: 'Финална нощ', desc: 'Главно парти с всички артисти.' },
  { day: 7, title: 'Завръщане', desc: 'Закуска, чекаут, трансфер.' },
]

export default function NolimitItineraryPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Програма</h1>
        <p className="text-white/50 mb-12">7 дни в Червено море</p>
        <div className="space-y-6">
          {DAYS.map((day) => (
            <div key={day.day} className="flex gap-6 border-b border-white/10 pb-6">
              <div className="flex-shrink-0 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold">{day.day}</div>
              <div>
                <h3 className="font-semibold mb-1">{day.title}</h3>
                <p className="text-sm text-white/50">{day.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
