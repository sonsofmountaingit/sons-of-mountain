import type { CollectionConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'stock', 'status'],
    group: 'Shop',
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        after(() => revalidateTag('products', 'default'))
        after(() => revalidateTag(`product-${doc.slug}`, 'default'))
        // Trigger stock alerts when item comes back in stock
        if (previousDoc?.stock === 0 && doc.stock > 0) {
          try {
            const alerts = await req.payload.find({
              collection: 'stock-alerts',
              where: {
                and: [
                  { itemType: { equals: 'product' } },
                  { product: { equals: doc.id } },
                  { status: { equals: 'pending' } },
                ],
              },
              limit: 100,
            })
            const { resend } = await import('@/lib/resend')
            const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'
            const site = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
            for (const alert of alerts.docs) {
              await resend.emails.send({
                from,
                to: (alert as any).email,
                subject: 'Back in stock!',
                html: `<p>Good news, ${(alert as any).name ?? 'adventurer'}! <strong>${doc.title}</strong> is back in stock. <a href="${site}/shop/products/${doc.slug}">Shop now</a></p>`,
              }).catch(() => {})
              await req.payload.update({ collection: 'stock-alerts', id: alert.id, data: { status: 'notified', notifiedAt: new Date().toISOString() } })
            }
          } catch {}
        }
      },
      async ({ doc, previousDoc, req }) => {
        after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'products' }))
      },
    ],
    afterDelete: [() => { after(() => revalidateTag('products', 'default')) }],
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
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { description: 'Price in EUR' },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      admin: { description: 'Original price before discount (shown as strikethrough)' },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'weight',
      type: 'number',
      admin: { position: 'sidebar', description: 'Weight in grams (for shipping calculation)' },
    },
    {
      name: 'variants',
      type: 'array',
      admin: { description: 'Size, color, or other variants' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'size', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'price', type: 'number', admin: { description: 'Override base price (leave empty to use base)' } },
        { name: 'stock', type: 'number', defaultValue: 0 },
        { name: 'sku', type: 'text' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'relationship', relationTo: 'media' },
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
