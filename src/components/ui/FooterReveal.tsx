'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let pluginRegistered = false
function ensurePlugin() {
  if (pluginRegistered) return
  gsap.registerPlugin(ScrollTrigger)
  pluginRegistered = true
}

export function FooterReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
    const triggers: ScrollTrigger[] = []
    let cancelled = false
    let mq: MediaQueryList | null = null

    // CSS is the source of truth: content is visible by default (see globals.css
    // .footer-reveal-item). We only add a transient inline style for the
    // animated entrance, and always clear it in cleanup/finally so a JS error
    // can never leave the footer stuck invisible.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || items.length === 0) {
      return
    }

    const clearInline = () => {
      items.forEach((item) => {
        item.style.removeProperty('opacity')
        item.style.removeProperty('transform')
      })
    }

    const setup = () => {
      if (cancelled || !el.isConnected) return
      try {
        ensurePlugin()

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
              clearProps: 'opacity,transform',
              scrollTrigger: {
                trigger: item,
                start: 'top 95%',
                toggleActions: 'play none none none',
                fastScrollEnd: true,
                once: true,
              },
            },
          )
          const st = tween.scrollTrigger
          if (st) triggers.push(st)
        })

        ScrollTrigger.refresh()
      } catch {
        // If gsap/ScrollTrigger throws for any reason, fail safe: drop any
        // inline styles it may have applied so the content stays visible.
        clearInline()
      }
    }

    const scheduleSetup = () => {
      requestAnimationFrame(() => requestAnimationFrame(setup))
    }

    const timers: number[] = []

    if (document.readyState === 'complete') {
      scheduleSetup()
    } else {
      window.addEventListener('load', scheduleSetup, { once: true })
      timers.push(window.setTimeout(scheduleSetup, 1500))
    }

    // Absolute safety net: whatever happens with gsap/ScrollTrigger timing,
    // guarantee visibility after a short grace period.
    const safety = window.setTimeout(clearInline, 2500)
    timers.push(safety)

    if (typeof window !== 'undefined' && window.matchMedia) {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      const onChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          triggers.forEach((t) => t.kill())
          clearInline()
        }
      }
      mq.addEventListener?.('change', onChange)
      return () => {
        cancelled = true
        window.removeEventListener('load', scheduleSetup)
        mq?.removeEventListener?.('change', onChange)
        timers.forEach((t) => clearTimeout(t))
        triggers.forEach((t) => t.kill())
      }
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', scheduleSetup)
      timers.forEach((t) => clearTimeout(t))
      triggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <div ref={ref} className="footer-reveal">
      {children}
    </div>
  )
}
