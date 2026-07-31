'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/use-translations'
import { updateConsent, getStoredConsent } from '@/lib/gtag'

export function CookieConsentBanner() {
  const { t } = useTranslations()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    if (stored) {
      updateConsent(stored)
    } else {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  function respond(choice: 'granted' | 'denied') {
    updateConsent(choice)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center justify-between gap-3 border-t border-white/10 bg-[#0a0a0a] px-6 py-4 text-white sm:flex-row">
      <p className="text-sm text-white/70">{t.cookie_consent.message}</p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => respond('denied')}
          className="rounded border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
        >
          {t.cookie_consent.decline}
        </button>
        <button
          onClick={() => respond('granted')}
          className="rounded bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors"
        >
          {t.cookie_consent.accept}
        </button>
      </div>
    </div>
  )
}
