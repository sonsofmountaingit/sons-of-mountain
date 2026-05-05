import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Empire of Corals — Panic Frame × EXE Group' }

export default function EmpirePage() {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-black/60 to-black" />
        <div className="relative z-10 px-8 md:px-16 pb-16 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Panic Frame × EXE Group</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">Empire of Corals</h1>
          <p className="text-xl text-white/60 mb-2">Първият в света мегаяхтен фестивал за електронна музика</p>
          <p className="text-white/40 mb-8">14-21 Ноември 2026 · Хургада, Египет</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/nolimit/sign-up" className="px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors">
              Запиши се
            </Link>
          </div>
        </div>
      </div>

      <div className="py-20 px-6 md:px-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { num: '1', label: 'Чартърен полет' },
            { num: '6', label: 'Мегаяхти' },
            { num: '6', label: 'Артисти' },
          ].map((stat) => (
            <div key={stat.label} className="text-center border border-white/10 rounded-xl p-8">
              <p className="text-6xl font-bold mb-2">{stat.num}</p>
              <p className="text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">За събитието</h2>
          <p className="text-white/60 leading-relaxed mb-6">
            Empire of Corals е безпрецедентно събитие — комбинация от лукс, музика и природата на Червено море. 6 мегаяхти, 6 артиста, 1 чартърен полет. Само 7 дни, които ще промените завинаги.
          </p>
          <p className="text-white/60 leading-relaxed">
            Организирано съвместно от Panic Frame и EXE Group.
          </p>
        </div>
      </div>
    </div>
  )
}
