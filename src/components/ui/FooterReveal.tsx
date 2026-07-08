'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function FooterReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    const triggers: ScrollTrigger[] = []

    items.forEach((item, i) => {
      const tween = gsap.fromTo(
        item,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          delay: i * 0.025,
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play none none none',
            fastScrollEnd: true,
          },
        }
      )
      const st = tween.scrollTrigger
      if (st) triggers.push(st)
    })

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((t) => t.kill())
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
