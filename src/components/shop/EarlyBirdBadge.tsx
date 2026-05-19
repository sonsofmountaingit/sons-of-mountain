'use client'

import { useEffect, useState } from 'react'

interface EarlyBirdBadgeProps {
  earlyBirdUntil: string
  savings: number
}

export function EarlyBirdBadge({ earlyBirdUntil, savings }: EarlyBirdBadgeProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function calc() {
      const diff = new Date(earlyBirdUntil).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft(''); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      setTimeLeft(d > 0 ? `${d}d ${h}h left` : `${h}h left`)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [earlyBirdUntil])

  if (!timeLeft) return null

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
      Early Bird — save €{savings} · {timeLeft}
    </span>
  )
}
