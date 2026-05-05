'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'motion/react'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface CounterStat {
  number: string
  suffix?: string | null
  label: string
  description?: string | null
}

interface CounterBlockProps {
  block: { title?: string | null; stats: CounterStat[] } & BlockStyleProps
}

function AnimatedNumber({ target, suffix }: { target: string; suffix?: string | null }) {
  const num = parseFloat(target.replace(/[^0-9.]/g, ''))
  const isNumeric = !isNaN(num)
  const [display, setDisplay] = useState(isNumeric ? '0' : target)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !isNumeric) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = num / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= num) { setDisplay(target); clearInterval(timer) }
      else setDisplay(Math.floor(start).toString())
    }, step)
    return () => clearInterval(timer)
  }, [inView, num, isNumeric, target])

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-bold tabular-nums">
      {display}{suffix}
    </span>
  )
}

export function CounterBlockRenderer({ block }: CounterBlockProps) {
  const { title, stats, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-[1200px] mx-auto px-6">
      {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
      <div className={`grid gap-8 text-center ${stats.length === 2 ? 'md:grid-cols-2' : stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        {stats.map((stat, i) => (
          <div key={i}>
            <AnimatedNumber target={stat.number} suffix={stat.suffix} />
            <p className="mt-2 font-semibold text-lg">{stat.label}</p>
            {stat.description && <p className="text-sm opacity-50 mt-1 leading-relaxed">{stat.description}</p>}
          </div>
        ))}
      </div>
    </BlockWrapper>
  )
}
