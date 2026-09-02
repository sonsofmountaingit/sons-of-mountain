'use client'

import { useEffect, useRef } from 'react'

interface AltchaEventDetail {
  payload?: string
  state: 'unverified' | 'verifying' | 'verified' | 'error'
}

export function Altcha({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    import('altcha').then(() => {
      if (!mounted) return
    })

    const el = containerRef.current
    if (!el) return

    function handleStateChange(event: Event) {
      const detail = (event as CustomEvent<AltchaEventDetail>).detail
      onToken(detail.state === 'verified' && detail.payload ? detail.payload : '')
    }

    el.addEventListener('statechange', handleStateChange)
    return () => {
      mounted = false
      el.removeEventListener('statechange', handleStateChange)
    }
  }, [onToken])

  return (
    <div ref={containerRef} className="altcha-container">
      {/* @ts-expect-error -- custom element registered by the 'altcha' package */}
      <altcha-widget challenge="/api/auth/captcha-challenge" auto="onload" configuration='{"hideLogo":true}' />
    </div>
  )
}
