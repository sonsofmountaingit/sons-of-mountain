import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

const revalidateFooterTrips = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('trips', 'default') }) } catch { /* noop */ }
  return doc
}
const revalidateFooterTripsDelete = () => {
  try { after(() => { revalidateTag('trips', 'default') }) } catch { /* noop */ }
}

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'startDate', 'status', 'spotsAvailable'],
    group: 'Пътувания',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'spotsTotal',
      type: 'number',
      required: true,
      defaultValue: 12,
    },
    {
      name: 'spotsAvailable',
      type: 'number',
      required: true,
      defaultValue: 12,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      options: ['BGN', 'EUR', 'USD'],
      defaultValue: 'EUR',
      required: true,
    },
    {
      name: 'depositAmount',
      type: 'number',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: ['Singles Only', 'Family', 'Adventure', 'Cultural', 'Beach', 'Yacht'],
        },
      ],
    },
    {
      name: 'itinerary',
      type: 'array',
      fields: [
        { name: 'day', type: 'number', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'stats',
          type: 'group',
          label: 'Статистики за деня',
          fields: [
            { name: 'ascent', type: 'text', label: 'Изкачване', admin: { description: 'e.g. 100м' } },
            { name: 'descent', type: 'text', label: 'Спускане', admin: { description: 'e.g. 100м' } },
            { name: 'distance', type: 'text', label: 'Разстояние', admin: { description: 'e.g. 5км' } },
            { name: 'duration', type: 'text', label: 'Време', admin: { description: 'e.g. 5ч' } },
            { name: 'accommodation', type: 'text', label: 'Настаняване', admin: { description: 'e.g. Хотел' } },
            { name: 'meals', type: 'text', label: 'Изхранване', admin: { description: 'e.g. Обяд и вечеря' } },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Sold Out', value: 'soldOut' },
        { label: 'Draft', value: 'draft' },
      ],
      defaultValue: 'active',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'earlyBirdPrice',
      type: 'number',
      admin: { description: 'Early bird discounted price' },
    },
    {
      name: 'earlyBirdUntil',
      type: 'date',
      admin: { description: 'Early bird deadline' },
    },
    {
      name: 'earlyBirdSpots',
      type: 'number',
      admin: { description: 'Number of early bird spots' },
    },
    {
      name: 'maxParticipantsPerRegistration',
      type: 'number',
      defaultValue: 4,
      admin: { description: 'Max participants per booking' },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, description: 'Page view count' },
    },
    {
      name: 'photographer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Photographer/creator for this trip' },
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
    {
      name: 'equipmentList',
      type: 'array',
      label: 'Необходима лична екипировка',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'readinessChecklist',
      type: 'array',
      label: 'Готов ли сте за приключение — чеклист',
      fields: [
        { name: 'category', type: 'text', required: true, label: 'Категория' },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'item', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'guides',
      type: 'relationship',
      relationTo: 'guides',
      hasMany: true,
      label: 'Водачи',
    },
  ],
  hooks: {
    afterChange: [
      revalidateCollection('trips', '/destinations'),
      revalidateFooterTrips,
      async ({ doc, previousDoc, req }) => {
        after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'trips', priceField: 'price' }))
      },
    ],
    afterDelete: [revalidateCollectionDelete('trips', '/destinations'), revalidateFooterTripsDelete],
  },
}
