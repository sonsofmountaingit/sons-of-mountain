import { after } from 'next/server'

/**
 * Run slow, non-transactional side effects after the current Next.js response.
 *
 * Payload invokes collection hooks before it commits the mutation transaction.
 * Network calls or extra Payload mutations in those hooks can otherwise leave the
 * transaction open and exhaust the shared Postgres pool. `after` runs only once
 * the request is complete, so each job receives a fresh transaction/connection.
 */
export async function afterResponse(work: () => Promise<void> | void): Promise<void> {
  try {
    after(async () => {
      try {
        await work()
      } catch (error) {
        console.error('Post-response side effect failed:', error)
      }
    })
  } catch {
    // Local scripts do not have a Next.js request lifecycle. Preserve their
    // synchronous behavior rather than silently dropping important work.
    await work()
  }
}
