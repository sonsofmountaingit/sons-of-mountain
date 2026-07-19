import type { CollectionConfig } from 'payload'
import { orderEmailFlows } from '../hooks/emailFlowTriggers'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'firstName',
      'lastName',
      'itemSummary',
      'status',
      'paymentMode',
      'totalAmount',
      'nextPaymentAmount',
      'nextPaymentDue',
      'createdAt',
    ],
    group: 'Shop',
  },
  hooks: {
    afterChange: [orderEmailFlows],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { readOnly: true },
    },
    {
      name: 'customerContext',
      type: 'text',
      virtual: true,
      admin: { readOnly: true, description: 'Loyalty points + total past orders for this customer', position: 'sidebar' },
      hooks: {
        afterRead: [
          async ({ data, req, findMany }) => {
            if (findMany) return ''
            const customerId = (data as any)?.customer
            const cid = typeof customerId === 'object' ? customerId?.id : customerId
            if (!cid) return ''
            const customer = await req.payload.findByID({ collection: 'customers', id: cid }).catch(() => null)
            const count = await req.payload.count({ collection: 'orders', where: { customer: { equals: cid } } }).catch(() => null)
            const points = (customer as any)?.loyaltyPoints ?? 0
            const totalOrders = count?.totalDocs ?? '?'
            return `${points} points · ${totalOrders} order(s) total`
          },
        ],
      },
    },
    {
      name: 'productType',
      type: 'text',
      admin: { description: 'Legacy: type of product (use items array for new orders)' },
    },
    {
      name: 'riskFlags',
      type: 'text',
      virtual: true,
      admin: { readOnly: true, description: 'Automated risk/status flags for this order', position: 'sidebar' },
      hooks: {
        afterRead: [
          async ({ data, req, findMany }) => {
            const d = data as any
            const flags: string[] = []
            const now = new Date()

            const overdue = (d?.paymentMode === 'installments' ? d?.installments ?? [] : [])
              .filter((i: any) => i.status === 'pending' && i.dueDate && new Date(i.dueDate) < now)
            if (overdue.length) flags.push(`⚠ ${overdue.length} overdue installment(s)`)
            if (d?.paymentMode === 'deposit' && d?.remainingDueDate && new Date(d.remainingDueDate) < now && !d?.balanceChargeStatus) {
              flags.push('⚠ balance overdue')
            }
            const failed = (d?.installments ?? []).filter((i: any) => i.status === 'failed')
            if (failed.length) flags.push(`✕ ${failed.length} failed charge(s)`)

            const customerId = typeof d?.customer === 'object' ? d?.customer?.id : d?.customer
            if (customerId && !findMany) {
              const count = await req.payload.count({ collection: 'orders', where: { customer: { equals: customerId } } }).catch(() => null)
              if ((count?.totalDocs ?? 0) <= 1) flags.push('★ first-time customer')
            }

            for (const it of d?.items ?? []) {
              const ref = it.trip ?? it.destination ?? it.program
              if (typeof ref === 'object' && ref?.spotsAvailable != null && (it.participantCount ?? 1) > ref.spotsAvailable) {
                flags.push(`⚠ participantCount exceeds spotsAvailable for item`)
              }
            }

            return flags.join(' · ') || 'OK'
          },
        ],
      },
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
      name: 'installments',
      type: 'array',
      admin: {
        description: 'Installment schedule (deposit/second/final payments)',
        condition: (data) => data.paymentMode === 'installments',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'dueDate', type: 'date', required: true },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Charged', value: 'charged' },
            { label: 'Failed', value: 'failed' },
          ],
          defaultValue: 'pending',
        },
        { name: 'paymentIntentId', type: 'text', admin: { readOnly: true } },
        { name: 'chargeAttemptedAt', type: 'date', admin: { readOnly: true } },
        { name: 'firstFailedAt', type: 'date', admin: { readOnly: true } },
        { name: 'overdueNoticeSent', type: 'checkbox', defaultValue: false, admin: { readOnly: true } },
        { name: 'remindersSent', type: 'array', admin: { readOnly: true }, fields: [{ name: 'daysBefore', type: 'number' }] },
      ],
    },
    {
      name: 'paymentTimeline',
      type: 'textarea',
      virtual: true,
      admin: { readOnly: true, description: 'Chronological payment history for this order' },
      hooks: {
        afterRead: [
          ({ data }) => {
            const d = data as any
            const events: Array<{ at: string; label: string }> = []
            if (d?.createdAt) events.push({ at: d.createdAt, label: 'Order created' })
            if (d?.stripeSessionId) events.push({ at: d.createdAt, label: `Checkout session created (${d.stripeSessionId})` })
            if (d?.paidAt) events.push({ at: d.paidAt, label: 'Marked paid' })
            if (d?.receiptSentAt) events.push({ at: d.receiptSentAt, label: 'Receipt sent' })
            for (const inst of d?.installments ?? []) {
              if (inst.chargeAttemptedAt) events.push({ at: inst.chargeAttemptedAt, label: `${inst.label}: charge attempted (${inst.status})` })
              if (inst.firstFailedAt) events.push({ at: inst.firstFailedAt, label: `${inst.label}: first failure` })
              if (inst.overdueNoticeSent) events.push({ at: inst.chargeAttemptedAt ?? inst.dueDate, label: `${inst.label}: overdue notice sent` })
            }
            if (d?.paymentMode === 'deposit' && d?.balanceChargeStatus) {
              events.push({ at: d.remainingDueDate, label: `Balance charge: ${d.balanceChargeStatus}` })
            }
            if (d?.refundAmount) events.push({ at: d.updatedAt, label: `Refunded €${d.refundAmount}` })
            events.sort((a, b) => new Date(a.at ?? 0).getTime() - new Date(b.at ?? 0).getTime())
            return events.map((e) => `${e.at ? new Date(e.at).toLocaleString('bg-BG') : '—'}: ${e.label}`).join('\n')
          },
        ],
      },
    },
    {
      name: 'relatedRecords',
      type: 'textarea',
      virtual: true,
      admin: { readOnly: true, description: 'Other records linked to this customer/order' },
      hooks: {
        afterRead: [
          async ({ data, req, findMany }) => {
            if (findMany) return ''
            const d = data as any
            const lines: string[] = []
            const customerId = typeof d?.customer === 'object' ? d?.customer?.id : d?.customer
            if (customerId) {
              const otherOrders = await req.payload.find({ collection: 'orders', where: { customer: { equals: customerId } }, limit: 5, sort: '-createdAt' }).catch(() => null)
              const others = (otherOrders?.docs ?? []).filter((o: any) => o.id !== d?.id)
              if (others.length) lines.push(`Other orders (${others.length}): ${others.map((o: any) => `#${o.id} (${o.status}, €${o.totalAmount})`).join(', ')}`)
              const regs = await req.payload.find({ collection: 'registrations', where: { customer: { equals: customerId } }, limit: 5, sort: '-createdAt' }).catch(() => null)
              if (regs?.docs?.length) lines.push(`Registrations (${regs.docs.length}): ${regs.docs.map((r: any) => `#${r.id} (${r.status})`).join(', ')}`)
            }
            if (d?.carpoolRide) lines.push(`Carpool ride: #${typeof d.carpoolRide === 'object' ? d.carpoolRide.id : d.carpoolRide}`)
            if (d?.discountCode) lines.push(`Discount code: #${typeof d.discountCode === 'object' ? d.discountCode.id : d.discountCode}`)
            if (d?.giftVoucher) lines.push(`Gift voucher: #${typeof d.giftVoucher === 'object' ? d.giftVoucher.id : d.giftVoucher}`)
            if (d?.bundle) lines.push(`Bundle: #${typeof d.bundle === 'object' ? d.bundle.id : d.bundle}`)
            return lines.join('\n') || 'None'
          },
        ],
      },
    },
    {
      name: 'manualCancelRequested',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Check to immediately cancel this order and free its spot, bypassing the grace period' },
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
      name: 'itemSummary',
      type: 'text',
      virtual: true,
      admin: { readOnly: true, description: 'What was ordered (derived from items)' },
      hooks: {
        afterRead: [
          async ({ data, req, findMany }) => {
            const items = (data as any)?.items ?? []
            if (!items.length) return (data as any)?.productType ?? ''
            if (findMany) {
              return items
                .map((it: any) => {
                  const ref = it.trip ?? it.product ?? it.program ?? it.destination ?? it.bundle
                  const title = typeof ref === 'object' ? ref?.title ?? ref?.name : null
                  return title ? `${title} x${it.quantity ?? 1}` : it.itemType
                })
                .filter(Boolean)
                .join('; ')
            }
            const collectionMap: Record<string, string> = { trip: 'trips', program: 'programs', destination: 'destinations', bundle: 'bundles', product: 'products' }
            const parts = await Promise.all(items.map(async (it: any) => {
              let ref = it.trip ?? it.product ?? it.program ?? it.destination ?? it.bundle
              const col = collectionMap[it.itemType]
              if (ref && typeof ref !== 'object' && col) {
                ref = await req.payload.findByID({ collection: col as any, id: ref }).catch(() => null)
              }
              const title = typeof ref === 'object' ? ref?.title ?? ref?.name : ref
              if (!title) return it.itemType
              const startDate = ref?.startDate ? new Date(ref.startDate).toLocaleDateString('bg-BG') : null
              const spots = ref?.spotsAvailable != null && ref?.spotsTotal != null ? `${ref.spotsAvailable}/${ref.spotsTotal} spots` : null
              const details = [startDate, spots].filter(Boolean).join(', ')
              return `${title} x${it.quantity ?? 1}${details ? ` (${details})` : ''}`
            }))
            return parts.filter(Boolean).join('; ')
          },
        ],
      },
    },
    {
      name: 'nextPaymentAmount',
      type: 'number',
      virtual: true,
      admin: { readOnly: true, description: 'Amount of the next pending payment' },
      hooks: {
        afterRead: [
          ({ data }) => {
            const d = data as any
            if (d?.paymentMode === 'deposit') return d?.remainingBalance ?? null
            if (d?.paymentMode === 'installments') {
              const next = (d?.installments ?? []).find((i: any) => i.status === 'pending')
              return next?.amount ?? null
            }
            return null
          },
        ],
      },
    },
    {
      name: 'nextPaymentDue',
      type: 'date',
      virtual: true,
      admin: { readOnly: true, description: 'Due date of the next pending payment' },
      hooks: {
        afterRead: [
          ({ data }) => {
            const d = data as any
            if (d?.paymentMode === 'deposit') return d?.remainingDueDate ?? null
            if (d?.paymentMode === 'installments') {
              const next = (d?.installments ?? []).find((i: any) => i.status === 'pending')
              return next?.dueDate ?? null
            }
            return null
          },
        ],
      },
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
            { label: 'Destination', value: 'destination' },
            { label: 'Gift Voucher', value: 'gift-voucher' },
            { label: 'Bundle', value: 'bundle' },
          ],
        },
        { name: 'trip', type: 'relationship', relationTo: 'trips', admin: { condition: (_, s) => s?.itemType === 'trip' } },
        { name: 'product', type: 'relationship', relationTo: 'products', admin: { condition: (_, s) => s?.itemType === 'product' } },
        { name: 'program', type: 'relationship', relationTo: 'programs', admin: { condition: (_, s) => s?.itemType === 'program' } },
        { name: 'destination', type: 'relationship', relationTo: 'destinations', admin: { condition: (_, s) => s?.itemType === 'destination' } },
        { name: 'bundle', type: 'relationship', relationTo: 'bundles', admin: { condition: (_, s) => s?.itemType === 'bundle' } },
        { name: 'variantId', type: 'text', admin: { description: 'Product variant ID if applicable' } },
        { name: 'quantity', type: 'number', defaultValue: 1 },
        { name: 'unitPrice', type: 'number' },
        { name: 'earlyBirdCount', type: 'number', admin: { description: 'Spots charged at early bird price' } },
        { name: 'earlyBirdPrice', type: 'number' },
        { name: 'regularCount', type: 'number', admin: { description: 'Spots charged at regular price' } },
        { name: 'regularPrice', type: 'number' },
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
      name: 'stripeLinks',
      type: 'text',
      virtual: true,
      admin: { readOnly: true, description: 'Direct links to Stripe Dashboard', position: 'sidebar' },
      hooks: {
        afterRead: [
          async ({ data, req, findMany }) => {
            if (findMany) return ''
            const d = data as any
            const isTest = (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_')
            const base = `https://dashboard.stripe.com/${isTest ? 'test/' : ''}`
            const links: string[] = []
            if (d?.stripeSessionId) links.push(`Session: ${base}checkout/sessions/${d.stripeSessionId}`)
            if (d?.stripePaymentIntentId) links.push(`PaymentIntent: ${base}payments/${d.stripePaymentIntentId}`)
            const customerId = typeof d?.customer === 'object' ? d?.customer?.id : d?.customer
            if (customerId) {
              const customer = await req.payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
              const custId = (customer as any)?.stripeCustomerId
              if (custId) links.push(`Customer: ${base}customers/${custId}`)
            }
            return links.join('\n') || ''
          },
        ],
      },
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
      name: 'stripePaymentLinkId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe Payment Link ID', position: 'sidebar' },
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
      name: 'carpoolRide',
      type: 'relationship',
      relationTo: 'carpool-rides',
      admin: { description: 'Свързано споделено пътуване (организатор или пътник)' },
    },
    {
      name: 'participationType',
      type: 'select',
      options: [
        { label: 'Организатор', value: 'organizer' },
        { label: 'Пътник', value: 'join' },
        { label: 'Сам', value: 'solo' },
      ],
      admin: { description: 'Тип участие в споделено пътуване' },
    },
  ],
}
