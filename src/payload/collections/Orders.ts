import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'paymentMode', 'totalAmount', 'createdAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true, description: 'Better Auth user ID (null = guest)' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { readOnly: true },
    },
    {
      name: 'productType',
      type: 'text',
      admin: { description: 'Legacy: type of product (use items array for new orders)' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Partial (Group)', value: 'partial' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentMode',
      type: 'select',
      options: [
        { label: 'Full Payment', value: 'full' },
        { label: 'Deposit', value: 'deposit' },
        { label: 'Installments (BNPL)', value: 'installments' },
      ],
      defaultValue: 'full',
      admin: { position: 'sidebar' },
    },
    {
      name: 'depositPaid',
      type: 'number',
      admin: { description: 'Amount of deposit paid (EUR)', condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'remainingBalance',
      type: 'number',
      admin: { description: 'Remaining balance due (EUR)', condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'remainingDueDate',
      type: 'date',
      admin: { description: 'Due date for remaining balance', condition: (data) => data.paymentMode === 'deposit' },
    },
    {
      name: 'installmentPlanId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe payment plan ID', condition: (data) => data.paymentMode === 'installments' },
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
      name: 'items',
      type: 'array',
      admin: { description: 'Order line items' },
      fields: [
        {
          name: 'itemType',
          type: 'select',
          required: true,
          options: [
            { label: 'Trip', value: 'trip' },
            { label: 'Product', value: 'product' },
            { label: 'Program', value: 'program' },
            { label: 'Gift Voucher', value: 'gift-voucher' },
            { label: 'Bundle', value: 'bundle' },
          ],
        },
        { name: 'trip', type: 'relationship', relationTo: 'trips', admin: { condition: (_, s) => s?.itemType === 'trip' } },
        { name: 'product', type: 'relationship', relationTo: 'products', admin: { condition: (_, s) => s?.itemType === 'product' } },
        { name: 'program', type: 'relationship', relationTo: 'programs', admin: { condition: (_, s) => s?.itemType === 'program' } },
        { name: 'bundle', type: 'relationship', relationTo: 'bundles', admin: { condition: (_, s) => s?.itemType === 'bundle' } },
        { name: 'variantId', type: 'text', admin: { description: 'Product variant ID if applicable' } },
        { name: 'quantity', type: 'number', defaultValue: 1 },
        { name: 'unitPrice', type: 'number' },
        { name: 'participantCount', type: 'number', defaultValue: 1 },
        {
          name: 'participantDetails',
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'dietary', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text' },
      ],
    },
    {
      name: 'discountCode',
      type: 'relationship',
      relationTo: 'discount-codes',
      admin: { readOnly: true },
    },
    {
      name: 'discountAmount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'giftVoucher',
      type: 'relationship',
      relationTo: 'gift-vouchers',
      admin: { readOnly: true },
    },
    {
      name: 'voucherAmountApplied',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'loyaltyPointsRedeemed',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'bundle',
      type: 'relationship',
      relationTo: 'bundles',
      admin: { readOnly: true },
    },
    {
      name: 'corporatePeopleCount',
      type: 'number',
      admin: { description: 'Total people for corporate/group pricing' },
    },
    {
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'taxAmount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'trackingNumber',
      type: 'text',
    },
    {
      name: 'shippingProvider',
      type: 'text',
    },
    {
      name: 'groupBookingId',
      type: 'text',
      admin: { description: 'Group booking identifier (split payment)' },
    },
    {
      name: 'participantLinks',
      type: 'array',
      admin: { description: 'Payment links for group booking participants' },
      fields: [
        { name: 'email', type: 'email' },
        { name: 'stripeLink', type: 'text' },
        { name: 'paid', type: 'checkbox', defaultValue: false },
        { name: 'paidAt', type: 'date' },
      ],
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
  ],
}
