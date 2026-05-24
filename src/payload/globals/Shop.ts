import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'

export const Shop: GlobalConfig = {
  slug: 'shop',
  admin: {
    group: 'Shop',
    description: 'Shop landing page content and settings',
  },
  hooks: {
    afterChange: [() => { after(() => revalidateTag('shop')) }],
  },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/ShopVisualEditorButton#ShopVisualEditorButton',
        },
      },
    },
    {
      name: 'heroTitle',
      type: 'text',
      defaultValue: 'Adventure Shop',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'featuredCategories',
      type: 'array',
      fields: [
        { name: 'category', type: 'relationship', relationTo: 'categories' },
      ],
    },
    {
      name: 'bannerText',
      type: 'text',
      admin: { description: 'Promotional banner text (e.g. Free shipping over €100)' },
    },
    {
      name: 'bannerCta',
      type: 'text',
    },
    {
      name: 'bannerCtaHref',
      type: 'text',
    },
    {
      name: 'loyaltyPointsPerEur',
      type: 'number',
      defaultValue: 1,
      admin: { description: 'Loyalty points earned per EUR spent (default: 1)' },
    },
    {
      name: 'loyaltyRedemptionRate',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Points needed for €1 discount (default: 100)' },
    },
    {
      name: 'bnplMinOrderAmount',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Minimum order amount (EUR) to show Buy Now Pay Later options' },
    },
    {
      name: 'freeShippingThreshold',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Free shipping on orders above this amount (EUR)' },
    },
    {
      name: 'featuredTitle',
      type: 'text',
      defaultValue: 'Featured Categories',
    },
    {
      name: 'voucherTitle',
      type: 'text',
      defaultValue: 'Gift Vouchers',
    },
    {
      name: 'voucherDescription',
      type: 'text',
      defaultValue: 'Give the gift of adventure',
    },
    {
      name: 'bundleTitle',
      type: 'text',
      defaultValue: 'Shop Bundles',
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
}
