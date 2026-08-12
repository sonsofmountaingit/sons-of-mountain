import type { CollectionAfterChangeHook } from 'payload'
import { sendOrderConfirmationEmail, sendRegistrationConfirmationEmail } from '@/lib/stripe-webhooks'
import { createEmailLog } from '@/lib/email-logger'

/**
 * Sends the canonical transactional receipt exactly once when a payment becomes
 * paid. Keeping this at the collection boundary covers Stripe webhooks, admin
 * payment confirmation, and every existing/future destination, trip, or program
 * without relying on optional Email Flow configuration.
 */
export const sendPurchaseConfirmation: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (doc.status !== 'paid' || (operation !== 'create' && previousDoc?.status === 'paid')) return doc

  const collectionSlug = collection.slug
  try {
    if (collectionSlug === 'orders') {
      await sendOrderConfirmationEmail(req.payload, String(doc.id))
    } else if (collectionSlug === 'registrations') {
      await sendRegistrationConfirmationEmail(req.payload, String(doc.id))
    }
  } catch (error) {
    // Do not fail a completed payment because a mail provider is temporarily
    // unavailable. The failed log makes the issue visible and auditable.
    await createEmailLog(req.payload, {
      trigger: collectionSlug === 'orders' ? 'order_confirmation' : 'registration_confirmation',
      recipient: doc.email,
      subject: 'Резервацията е потвърдена — Sons of Mountains',
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      context: collectionSlug === 'orders' ? { orderId: String(doc.id) } : { registrationId: String(doc.id) },
    }).catch(() => {})
    console.error(`Purchase confirmation email failed for ${collectionSlug} ${doc.id}:`, error)
  }

  return doc
}
