import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)
const revalidateFooterTrips = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('trips') }) } catch { /* noop */ }
  return doc
}
const revalidateFooterTripsDelete = () => {
  try { after(() => { revalidateTag('trips') }) } catch { /* noop */ }
}

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'status', 'price', 'spotsAvailable'],
    group: 'Пътувания',
  },
  fields: [
    // Core identity
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    // Booking / pricing
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'currency',
      type: 'select',
      options: ['BGN', 'EUR', 'USD'],
      defaultValue: 'EUR',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'depositAmount',
      type: 'number',
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
      name: 'spotsTotal',
      type: 'number',
      required: true,
      defaultValue: 12,
      admin: { position: 'sidebar' },
    },
    {
      name: 'spotsAvailable',
      type: 'number',
      required: true,
      defaultValue: 12,
      admin: { position: 'sidebar' },
    },
    {
      name: 'maxParticipantsPerRegistration',
      type: 'number',
      defaultValue: 4,
      admin: { description: 'Max participants per booking' },
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
    // Dates
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
    // Stripe — auto-managed
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stripePaymentLinkId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stripePaymentLinkUrl',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    // Content — fully owned by the trip
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'previewVideo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Short preview video (mp4) shown in the "Why Travel With Us" section.' },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. Рила, България' },
    },
    {
      name: 'continent',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. Европа — used in "Other trips in X"' },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: ['Singles Only', 'Family', 'Adventure', 'Cultural', 'Beach', 'Yacht', 'Hiking', 'Ski', 'Wellness'],
        },
      ],
    },
    {
      name: 'whyImages',
      type: 'array',
      admin: { description: 'Images for the "Защо?" section' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'whyVisit',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'richText' },
      ],
    },
    {
      name: 'fitnessSummaryHeading',
      type: 'text',
    },
    {
      name: 'fitnessSummaryText',
      type: 'richText',
    },
    {
      name: 'fitnessRatings',
      type: 'group',
      fields: [
        { name: 'difficulty', type: 'number', min: 0, max: 100, defaultValue: 50 },
        { name: 'comfort', type: 'number', min: 0, max: 100, defaultValue: 50 },
        { name: 'nature', type: 'number', min: 0, max: 100, defaultValue: 50 },
        { name: 'culture', type: 'number', min: 0, max: 100, defaultValue: 50 },
      ],
    },
    {
      name: 'travelTitle',
      type: 'text',
    },
    {
      name: 'travelDescription',
      type: 'richText',
    },
    {
      name: 'travelImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'transportTitle',
      type: 'text',
    },
    {
      name: 'transportDescription',
      type: 'richText',
    },
    {
      name: 'transportImage',
      type: 'upload',
      relationTo: 'media',
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
            { name: 'ascent', type: 'text', label: 'Изкачване' },
            { name: 'descent', type: 'text', label: 'Спускане' },
            { name: 'distance', type: 'text', label: 'Разстояние' },
            { name: 'duration', type: 'text', label: 'Време' },
            { name: 'accommodation', type: 'text', label: 'Настаняване' },
            { name: 'meals', type: 'text', label: 'Изхранване' },
          ],
        },
      ],
    },
    {
      name: 'accommodations',
      type: 'array',
      fields: [
        { name: 'locationLabel', type: 'text' },
        { name: 'name', type: 'text' },
        { name: 'description', type: 'richText' },
        { name: 'learnMoreUrl', type: 'text' },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'alt', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'richText' },
      ],
    },
    {
      name: 'included',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'notIncluded',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'communityPhotos',
      type: 'array',
      fields: [{ name: 'photo', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'priceIncludes',
      type: 'textarea',
    },
    {
      name: 'durationDays',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      admin: { position: 'sidebar' },
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
    {
      name: 'photographer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [
      revalidateCollection('trips', '/trips'),
      revalidateFooterTrips,
      async ({ doc, previousDoc, req }) => {
        try {
          after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'trips', priceField: 'price' }))
        } catch {
          await syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'trips', priceField: 'price' })
        }
      },
    ],
    afterDelete: [revalidateCollectionDelete('trips', '/trips'), revalidateFooterTripsDelete],
  },
}
