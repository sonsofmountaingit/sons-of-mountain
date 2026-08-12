import { after } from 'next/server'

/**
 * Defers external side effects until after the request response and its Payload
 * transaction have completed. This must be used for provider calls from hooks:
 * a provider can accept a request even when the surrounding database transaction
 * later rolls back.
 */
export function afterResponse(work: () => Promise<void>): void {
  after(() => work().catch((error) => {
    console.error('Post-response side effect failed:', error)
  }))
}
