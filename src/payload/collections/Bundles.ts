import type { CollectionConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

export const Bundles: CollectionConfig = {
  slug: 'bundles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'bundlePrice', 'isActive', 'usedCount', 'expiresAt'],
    group: 'Shop',
  },
  hooks: {
    afterChange: [
      () => { after(() => revalidateTag('bundles', 'default')) },
      async ({ doc, previousDoc, req }) => {
        try {
          after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'bundles', priceField: 'bundlePrice' }))
        } catch {
          await syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'bundles', priceField: 'bundlePrice' })
        }
      },
    ],
    afterDelete: [() => { after(() => revalidateTag('bundles', 'default')) }],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'startsAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'maxUses',
      type: 'number',
      admin: { position: 'sidebar', description: 'Leave empty = unlimited' },
    },
    {
      name: 'usedCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: { description: 'Items included in this bundle' },
      fields: [
        {
          name: 'itemType',
          type: 'select',
          required: true,
          options: [
            { label: 'Trip', value: 'trip' },
            { label: 'Product', value: 'product' },
            { label: 'Program', value: 'program' },
          ],
        },
        { name: 'trip', type: 'relationship', relationTo: 'trips', admin: { condition: (_, s) => s?.itemType === 'trip' } },
        { name: 'product', type: 'relationship', relationTo: 'products', admin: { condition: (_, s) => s?.itemType === 'product' } },
        { name: 'program', type: 'relationship', relationTo: 'programs', admin: { condition: (_, s) => s?.itemType === 'program' } },
        { name: 'quantity', type: 'number', defaultValue: 1 },
      ],
    },
    {
      name: 'bundlePrice',
      type: 'number',
      required: true,
      admin: { description: 'Final bundle price in EUR (what customer pays)' },
    },
    {
      name: 'basePrice',
      type: 'number',
      admin: { description: 'Sum of individual item prices (display only, shown as strikethrough)' },
    },
    {
      name: 'savingsPercent',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated savings %' },
    },
    {
      name: 'corporatePricing',
      type: 'array',
      admin: { description: 'Group/corporate pricing tiers' },
      fields: [
        { name: 'minPeople', type: 'number', required: true, admin: { description: 'Minimum number of participants' } },
        { name: 'pricePerPerson', type: 'number', required: true, admin: { description: 'Price per person in EUR' } },
        { name: 'label', type: 'text', admin: { description: 'E.g. "Corporate team"' } },
      ],
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe Product ID (auto-created)', position: 'sidebar' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe Price ID (auto-created)', position: 'sidebar' },
    },
    {
      name: 'stripePaymentLinkId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe Payment Link ID', position: 'sidebar' },
    },
    {
      name: 'stripePaymentLinkUrl',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe Payment Link URL', position: 'sidebar' },
    },
  ],
}
