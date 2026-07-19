import { getPayload } from 'payload'
import config from '@payload-config'

const FLOWS: { label: string; trigger: string }[] = [
  { label: 'Registration: Pending (request received)', trigger: 'registration_pending' },
  { label: 'Registration: Paid — Full Payment', trigger: 'registration_paid_full' },
  { label: 'Registration: Paid — Deposit', trigger: 'registration_paid_deposit' },
  { label: 'Registration: Confirmed by admin', trigger: 'registration_confirmed' },
  { label: 'Registration: Cancelled', trigger: 'registration_cancelled' },
  { label: 'Registration: Refunded', trigger: 'registration_refunded' },
  { label: 'Registration: Balance due in 7 days', trigger: 'registration_balance_due_7d' },
  { label: 'Registration: Balance due tomorrow', trigger: 'registration_balance_due_1d' },
  { label: 'Registration: Balance overdue', trigger: 'registration_balance_overdue' },
  { label: 'Registration: Balance charge failed (Stripe)', trigger: 'registration_balance_failed' },
  { label: 'Registration: Trip reminder 7 days before', trigger: 'registration_trip_reminder_7d' },
  { label: 'Registration: Trip reminder 1 day before', trigger: 'registration_trip_reminder_1d' },
  { label: 'Registration: Checked in (QR scanned)', trigger: 'registration_checkin' },
  { label: 'Registration: Certificate issued', trigger: 'registration_certificate' },
  { label: 'Registration: Post-trip review request', trigger: 'registration_review_request' },
  { label: 'Order: Paid — Full Payment', trigger: 'order_paid_full' },
  { label: 'Order: Paid — Deposit', trigger: 'order_paid_deposit' },
  { label: 'Order: Cancelled', trigger: 'order_cancelled' },
  { label: 'Order: Refunded', trigger: 'order_refunded' },
  { label: 'Order: Shipped (tracking set)', trigger: 'order_shipped' },
  { label: 'Order: Balance due in 7 days', trigger: 'order_balance_due_7d' },
  { label: 'Order: Balance due tomorrow', trigger: 'order_balance_due_1d' },
  { label: 'Order: Balance charge failed (Stripe)', trigger: 'order_balance_failed' },
  { label: 'Gift Voucher: Delivery to recipient', trigger: 'gift_voucher_recipient' },
  { label: 'Gift Voucher: Purchase confirmation to buyer', trigger: 'gift_voucher_buyer' },
  { label: 'Gift Voucher: Expiry reminder (7 days)', trigger: 'gift_voucher_expiry_7d' },
  { label: 'Subscription: Created / Welcome', trigger: 'subscription_created' },
  { label: 'Subscription: Payment failed (dunning 1)', trigger: 'subscription_payment_failed' },
  { label: 'Subscription: Payment failed (dunning 2)', trigger: 'subscription_dunning_2' },
  { label: 'Subscription: Payment failed (dunning 3 — final)', trigger: 'subscription_dunning_3' },
  { label: 'Subscription: Payment recovered', trigger: 'subscription_payment_recovered' },
  { label: 'Subscription: Cancelled', trigger: 'subscription_cancelled' },
  { label: 'Subscription: Renewal reminder (3 days)', trigger: 'subscription_renewal_3d' },
  { label: 'Loyalty: Tier upgraded', trigger: 'loyalty_tier_upgrade' },
  { label: 'Waitlist: Joined', trigger: 'waitlist_joined' },
  { label: 'Waitlist: Spot available', trigger: 'waitlist_spot_available' },
  { label: 'Waitlist: Offer expired', trigger: 'waitlist_expired' },
  { label: 'Stock Alert: Back in stock', trigger: 'stock_alert_notified' },
  { label: 'Abandoned Cart: 1 hour nudge', trigger: 'abandoned_cart_1h' },
  { label: 'Abandoned Cart: 24 hour nudge', trigger: 'abandoned_cart_24h' },
  { label: 'Auth: Password reset', trigger: 'auth_password_reset' },
  { label: 'Auth: Email verification', trigger: 'auth_email_verification' },
]

async function main() {
  const payload = await getPayload({ config })
  let created = 0

  for (const flow of FLOWS) {
    const existing = await payload.find({ collection: 'email-flows', where: { trigger: { equals: flow.trigger } }, limit: 1 })
    if (existing.docs.length > 0) continue
    await payload.create({ collection: 'email-flows', data: { ...flow, enabled: false } as any })
    created++
  }

  console.log(`Seeded ${created} email flows (${FLOWS.length - created} already existed).`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
