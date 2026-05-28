'use client'

import { useEffect, useRef, useState } from 'react'

function parseNumber(str: string): number {
  const s = str.trim().toUpperCase()
  if (s.endsWith('K')) return parseFloat(s) * 1000
  if (s.endsWith('M')) return parseFloat(s) * 1000000
  return parseFloat(s) || 0
}

function formatNumber(n: number, template: string): string {
  const s = template.trim().toUpperCase()
  if (s.endsWith('K')) return (n / 1000).toFixed(1) + 'K'
  if (s.endsWith('M')) return (n / 1000000).toFixed(1) + 'M'
  return Math.round(n).toString()
}

function Counter({ target, label }: { target: string; label: string }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const end = parseNumber(target)
          const duration = 1800
          const fps = 60
          const steps = (duration / 1000) * fps
          let frame = 0
          const interval = setInterval(() => {
            frame++
            const progress = frame / steps
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(formatNumber(end * eased, target))
            if (frame >= steps) {
              clearInterval(interval)
              setDisplay(target)
            }
          }, 1000 / fps)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <span style={{
        fontSize: 'clamp(3rem, 8vw, 7rem)',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        color: '#ffffff',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {display}
      </span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </span>
    </div>
  )
}

export function FooterSocialCounter({
  facebookUrl,
  facebookFollowers,
  instagramUrl,
  instagramFollowers,
}: {
  facebookUrl: string
  facebookFollowers: string
  instagramUrl: string
  instagramFollowers: string
}) {
  return (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <Counter target={facebookFollowers} label="Facebook" />
      </a>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <Counter target={instagramFollowers} label="Instagram" />
      </a>
    </div>
  )
}
