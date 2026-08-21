import { after } from 'next/server'

/**
 * Defers external side effects until after the request response and its Payload
 * transaction have completed. Uses Next.js after() when available inside a
 * request lifecycle, and safely falls back to asynchronous execution (setImmediate)
 * if called outside request context or if after() throws.
 */
export function afterResponse(work: () => Promise<void>): void {
  try {
    after(async () => {
      try {
        await work()
      } catch (error) {
        console.error('Post-response side effect failed:', error)
      }
    })
  } catch {
    setImmediate(async () => {
      try {
        await work()
      } catch (error) {
        console.error('Post-response side effect failed:', error)
      }
    })
  }
}
