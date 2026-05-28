'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'

type ChecklistCategory = {
  category: string
  items: { item: string }[]
}

type Props = {
  categories: ChecklistCategory[]
}

export default function ReadinessChecklistSection({ categories }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const progressBarRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  const allItems = categories.flatMap(c => c.items.map(i => `${c.category}::${i.item}`))
  const total = allItems.length
  const progress = total > 0 ? (checked.size / total) * 100 : 0

  const toggle = useCallback((key: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  useEffect(() => {
    if (!progressBarRef.current) return
    gsap.to(progressBarRef.current, { width: `${progress}%`, duration: 0.5, ease: 'power2.out' })

    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#fff', '#aaa', '#555'] })
      setTimeout(() => confetti({ particleCount: 60, spread: 50, origin: { x: 0.2, y: 0.5 }, colors: ['#fff', '#aaa'] }), 250)
      setTimeout(() => confetti({ particleCount: 60, spread: 50, origin: { x: 0.8, y: 0.5 }, colors: ['#fff', '#aaa'] }), 450)
      if (messageRef.current) {
        gsap.fromTo(messageRef.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      }
    }
    if (progress < 100) completedRef.current = false
  }, [progress])

  if (!categories?.length) return null

  return (
    <div className="px-5 sm:px-8 lg:px-16 py-10 sm:py-0">
      <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-3" data-animate="fade-up">
        Готовност
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight" data-animate="fade-up">
        Готови ли сте за<br />приключение?
      </h2>

      <div className="mb-8" data-animate="fade-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white/30 uppercase tracking-wide">Напредък</span>
          <span className="text-xs font-bold text-white/70">{Math.round(progress)}%</span>
        </div>
        <div className="h-px bg-white/10 rounded-full overflow-hidden">
          <div ref={progressBarRef} className="h-full bg-white rounded-full" style={{ width: '0%' }} />
        </div>
      </div>

      {progress >= 100 && (
        <div ref={messageRef} className="mb-8 inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-full">
          <span>✓</span>
          Напълно подготвени сте за пътешествието!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8" data-animate="stagger-children">
        {categories.map((cat) => (
          <div key={cat.category}>
            <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3 border-b border-white/10 pb-2">
              {cat.category}
            </p>
            <ul className="space-y-0.5">
              {cat.items.map((i) => {
                const key = `${cat.category}::${i.item}`
                const isChecked = checked.has(key)
                return (
                  <li key={key}>
                    <label className="flex items-center gap-3 cursor-pointer group py-2">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => toggle(key)}
                      />
                      <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 ${isChecked ? 'bg-white border-white' : 'border-white/25 bg-transparent group-hover:border-white/50'}`}>
                        {isChecked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm transition-colors duration-150 leading-snug ${isChecked ? 'text-white/30 line-through' : 'text-white/60 group-hover:text-white'}`}>
                        {i.item}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
