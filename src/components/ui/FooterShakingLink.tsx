'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

export function FooterShakingLink({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  function shake() {
    if (tl.current) tl.current.kill()
    tl.current = gsap.timeline()
    tl.current
      .to(ref.current, { x: 1.5, y: -0.5, rotate: 0.8, duration: 0.07, ease: 'power1.inOut' })
      .to(ref.current, { x: -1.5, y: 0.5, rotate: -0.8, duration: 0.07, ease: 'power1.inOut' })
      .to(ref.current, { x: 1, y: -0.3, rotate: 0.5, duration: 0.06, ease: 'power1.inOut' })
      .to(ref.current, { x: -1, y: 0.3, rotate: -0.5, duration: 0.06, ease: 'power1.inOut' })
      .to(ref.current, { x: 0, y: 0, rotate: 0, duration: 0.05, ease: 'power1.out' })
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={shake}
      style={{ display: 'inline-block', ...style }}
    >
      {children}
    </Link>
  )
}
