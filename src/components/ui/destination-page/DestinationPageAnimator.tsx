'use client'

import { useEffect } from 'react'

export function DestinationPageAnimator() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)

      const fadeUps = document.querySelectorAll<HTMLElement>('[data-animate="fade-up"]')
      fadeUps.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      const staggerGroups = document.querySelectorAll<HTMLElement>('[data-animate="stagger-children"]')
      staggerGroups.forEach((el) => {
        const children = Array.from(el.children) as HTMLElement[]
        gsap.fromTo(
          children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      const scaleIns = document.querySelectorAll<HTMLElement>('[data-animate="scale-in"]')
      scaleIns.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill())
    })

    return () => cleanup?.()
  }, [])

  return null
}
