'use client'

import { useField } from '@payloadcms/ui'
import { Editor } from '@maily-to/core'
import type { JSONFieldClientProps } from 'payload'
import type { JSONContent } from '@tiptap/react'

const VARIABLES: { name: string; label: string }[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'email', label: 'Email Address' },
  { name: 'siteUrl', label: 'Site URL' },
  { name: 'siteName', label: 'Site Name' },
  { name: 'currentYear', label: 'Current Year' },
  { name: 'unsubscribe_url', label: 'Unsubscribe URL' },
  { name: 'tripTitle', label: 'Trip Title' },
  { name: 'tripStartDate', label: 'Trip Start Date' },
  { name: 'tripEndDate', label: 'Trip End Date' },
  { name: 'tripLocation', label: 'Trip Location' },
  { name: 'participantCount', label: 'Participant Count' },
  { name: 'totalAmount', label: 'Total Amount' },
  { name: 'currency', label: 'Currency' },
  { name: 'depositAmount', label: 'Deposit Amount' },
  { name: 'remainingBalance', label: 'Remaining Balance' },
  { name: 'remainingDueDate', label: 'Remaining Due Date' },
  { name: 'invoiceUrl', label: 'Invoice PDF URL' },
  { name: 'qrToken', label: 'QR Token' },
  { name: 'refundAmount', label: 'Refund Amount' },
  { name: 'stripeRefundId', label: 'Stripe Refund ID' },
  { name: 'orderItems', label: 'Order Items (HTML list)' },
  { name: 'orderTotal', label: 'Order Total' },
  { name: 'trackingNumber', label: 'Tracking Number' },
  { name: 'shippingProvider', label: 'Shipping Provider' },
  { name: 'shippingAddress', label: 'Shipping Address' },
  { name: 'voucherCode', label: 'Voucher Code' },
  { name: 'voucherAmount', label: 'Voucher Amount' },
  { name: 'voucherExpiry', label: 'Voucher Expiry Date' },
  { name: 'voucherMessage', label: 'Voucher Personal Message' },
  { name: 'recipientName', label: 'Recipient Name' },
  { name: 'senderName', label: 'Sender Name' },
  { name: 'subscriptionPlan', label: 'Subscription Plan' },
  { name: 'subscriptionPeriodEnd', label: 'Subscription Period End' },
  { name: 'discountCode', label: 'Discount Code' },
  { name: 'dunningCount', label: 'Dunning Attempt Number' },
  { name: 'billingUpdateUrl', label: 'Billing Update URL' },
  { name: 'loyaltyTier', label: 'Loyalty Tier (bronze/silver/gold/platinum)' },
  { name: 'loyaltyPoints', label: 'Loyalty Points' },
  { name: 'previousTier', label: 'Previous Loyalty Tier' },
  { name: 'loyaltyTierLabel', label: 'Loyalty Tier Label' },
  { name: 'waitlistPosition', label: 'Waitlist Position' },
  { name: 'bookNowUrl', label: 'Book Now URL' },
  { name: 'itemTitle', label: 'Item Title' },
  { name: 'cartItems', label: 'Cart Items (HTML list)' },
  { name: 'cartTotal', label: 'Cart Total' },
  { name: 'cartUrl', label: 'Cart URL' },
  { name: 'resetUrl', label: 'Password Reset URL' },
  { name: 'verifyUrl', label: 'Email Verification URL' },
  { name: 'featuredTrips', label: 'Featured Trips (array — use with Repeat block)' },
  { name: 'featuredPrograms', label: 'Featured Programs (array — use with Repeat block)' },
  { name: 'featuredDestinations', label: 'Featured Destinations (array — use with Repeat block)' },
]

export function MailyEditor({ field, path }: JSONFieldClientProps) {
  const { value, setValue } = useField<JSONContent>({ path: path ?? field.name })

  return (
    <div className="maily-editor-field" data-theme="dark">
      <details style={{ marginBottom: 8 }}>
        <summary style={{ cursor: 'pointer', fontSize: 12, color: '#888' }}>Available merge tags</summary>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 0' }}>
          {VARIABLES.map((v) => (
            <code key={v.name} title={v.label} style={{ fontSize: 11, background: '#1a1a1a', padding: '2px 6px', borderRadius: 3 }}>
              {`{{${v.name}}}`}
            </code>
          ))}
        </div>
      </details>
      <div style={{ height: 600, width: '100%' }}>
        <Editor
          contentJson={value ?? undefined}
          onUpdate={(editor) => setValue(editor.getJSON())}
        />
      </div>
    </div>
  )
}
