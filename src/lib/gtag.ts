export interface GtagItem {
  item_id: string
  item_name: string
  price: number
  item_category?: string
  quantity?: number
}

export function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('event', name, params)
}

export function fireOncePerSession(key: string, fn: () => void) {
  try {
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
  } catch {}
  fn()
}

export const CONSENT_STORAGE_KEY = 'som_consent'

export type ConsentChoice = 'granted' | 'denied'

export function updateConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ad_storage: choice,
      analytics_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
    })
  }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice)
  } catch {}
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}
