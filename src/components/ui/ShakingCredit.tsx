'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ShakingCreditProps {
  name: string
  href: string
}

export function ShakingCredit({ name, href }: ShakingCreditProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 })
    tl.to(ref.current, {
      x: 2,
      y: -1,
      rotate: 1.5,
      duration: 0.07,
      ease: 'power1.inOut',
    })
      .to(ref.current, {
        x: -2,
        y: 1,
        rotate: -1.5,
        duration: 0.07,
        ease: 'power1.inOut',
      })
      .to(ref.current, {
        x: 1.5,
        y: -0.5,
        rotate: 1,
        duration: 0.06,
        ease: 'power1.inOut',
      })
      .to(ref.current, {
        x: -1,
        y: 0.5,
        rotate: -1,
        duration: 0.06,
        ease: 'power1.inOut',
      })
      .to(ref.current, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.05,
        ease: 'power1.out',
      })
    return () => { tl.kill() }
  }, [])

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        color: 'rgba(255,255,255,0.9)',
        textDecoration: 'none',
        fontWeight: 700,
      }}
    >
      {name}
    </a>
  )
}
