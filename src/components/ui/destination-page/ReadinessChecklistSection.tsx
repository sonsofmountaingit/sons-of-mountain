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
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#000', '#555', '#aaa'] })
      setTimeout(() => confetti({ particleCount: 60, spread: 50, origin: { x: 0.2, y: 0.5 }, colors: ['#000', '#555'] }), 250)
      setTimeout(() => confetti({ particleCount: 60, spread: 50, origin: { x: 0.8, y: 0.5 }, colors: ['#000', '#555'] }), 450)
      if (messageRef.current) {
        gsap.fromTo(messageRef.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      }
    }
    if (progress < 100) completedRef.current = false
  }, [progress])

  if (!categories?.length) return null

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-3" data-animate="fade-up">
          ГОТОВНОСТ
        </p>
        <h2 className="text-3xl font-bold mb-8" data-animate="fade-up">
          Готови ли сте за приключение?
        </h2>

        <div className="mb-8" data-animate="fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-black/50 uppercase tracking-wide">Напредък</span>
            <span className="text-xs font-bold text-black">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-black/10 rounded-full overflow-hidden">
            <div ref={progressBarRef} className="h-full bg-black rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        {progress >= 100 && (
          <div ref={messageRef} className="mb-8 inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-full">
            <span>✓</span>
            Напълно подготвени сте за пътешествието!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8" data-animate="stagger-children">
          {categories.map((cat) => (
            <div key={cat.category}>
              <p className="text-xs font-semibold tracking-widest text-black/50 uppercase mb-4 border-b border-black/10 pb-2">
                {cat.category}
              </p>
              <ul className="space-y-1">
                {cat.items.map((i) => {
                  const key = `${cat.category}::${i.item}`
                  const isChecked = checked.has(key)
                  return (
                    <li key={key}>
                      <label className="flex items-center gap-3 cursor-pointer group py-1.5">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => toggle(key)}
                        />
                        <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 ${isChecked ? 'bg-black border-black' : 'border-black/30 bg-white group-hover:border-black/60'}`}>
                          {isChecked && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm transition-colors duration-150 leading-snug ${isChecked ? 'text-black/40 line-through' : 'text-black/80 group-hover:text-black'}`}>
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
    </section>
  )
}
