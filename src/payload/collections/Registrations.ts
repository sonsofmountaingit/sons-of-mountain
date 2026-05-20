import type { CollectionConfig } from 'payload'
import { syncSpotsAfterChange, syncSpotsAfterDelete } from '../hooks/syncTripSpots'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'trip', 'destination', 'status', 'totalAmount', 'createdAt'],
    group: 'Регистрации',
  },
  hooks: {
    afterChange: [syncSpotsAfterChange],
    afterDelete: [syncSpotsAfterDelete],
  },
  fields: [
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true, description: 'Better Auth user ID (null = гост)' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { readOnly: true, description: 'Клиент (ако е регистриран)' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Чакащ', value: 'pending' },
        { label: 'Потвърден', value: 'confirmed' },
        { label: 'Платен', value: 'paid' },
        { label: 'Отказан', value: 'cancelled' },
        { label: 'Върнат', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'participantCount',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'dietaryNotes',
      type: 'textarea',
    },
    {
      name: 'questions',
      type: 'textarea',
    },
    {
      name: 'agreedToTerms',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripeRefundId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe refund ID', position: 'sidebar' },
    },
    {
      name: 'refundAmount',
      type: 'number',
      admin: { readOnly: true, description: 'Amount refunded (EUR)', position: 'sidebar' },
    },
    {
      name: 'invoiceId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe invoice ID', position: 'sidebar' },
    },
    {
      name: 'invoicePdfUrl',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe invoice PDF URL', position: 'sidebar' },
    },
    {
      name: 'balancePaymentIntentId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe PaymentIntent for balance charge', condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'balanceChargeStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: { readOnly: true, condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'reminderSent7d',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true, condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'reminderSent1d',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true, condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'scaVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true, description: '3DS / SCA authentication confirmed', position: 'sidebar' },
    },
    {
      name: 'receiptSentAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'totalAmount',
      type: 'number',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'EUR',
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'paymentMode',
      type: 'select',
      options: [
        { label: 'Full Payment', value: 'full' },
        { label: 'Deposit', value: 'deposit' },
        { label: 'Installments', value: 'installments' },
      ],
      defaultValue: 'full',
    },
    {
      name: 'depositPaid',
      type: 'number',
      admin: { condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'remainingBalance',
      type: 'number',
      admin: { condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'remainingDueDate',
      type: 'date',
      admin: { condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'checkedIn',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Scanned QR at trip check-in' },
    },
    {
      name: 'checkedInAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'qrToken',
      type: 'text',
      admin: { readOnly: true, description: 'HMAC token for QR code validation' },
    },
    {
      name: 'certificateIssuedAt',
      type: 'date',
      admin: { readOnly: true, description: 'When completion certificate was generated' },
    },
  ],
}
