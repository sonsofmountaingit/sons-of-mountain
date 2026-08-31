'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void; action?: string }) => string
      reset: (widgetId?: string) => void
    }
  }
}

export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || !containerRef.current) return
    let cancelled = false
    const render = () => {
      if (!cancelled && containerRef.current && window.turnstile && !widgetId.current) {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: 'signup',
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        })
      }
    }
    if (window.turnstile) render()
    else {
      const script = document.querySelector('script[data-turnstile]')
      if (script) script.addEventListener('load', render, { once: true })
      else {
        const next = document.createElement('script')
        next.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        next.async = true
        next.defer = true
        next.dataset.turnstile = 'true'
        next.addEventListener('load', render, { once: true })
        document.head.appendChild(next)
      }
    }
    return () => { cancelled = true }
  }, [onToken, siteKey])

  if (!siteKey) return null
  return <div ref={containerRef} className="min-h-[65px] flex justify-center" aria-label="Security verification" />
}
