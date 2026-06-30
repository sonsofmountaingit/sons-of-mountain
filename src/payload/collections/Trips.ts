import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag
const revalidateFooterTrips = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('trips', 'max'); revalidateTag('megamenu', 'max') }) } catch { /* noop */ }
  return doc
}
const revalidateFooterTripsDelete = () => {
  try { after(() => { revalidateTag('trips', 'max'); revalidateTag('megamenu', 'max') }) } catch { /* noop */ }
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
    {
      name: 'navSection',
      type: 'select',
      options: [
        { label: 'В България', value: 'bulgaria' },
        { label: 'В чужбина', value: 'abroad' },
        { label: 'Индивидуално приключение', value: 'individual' },
      ],
      admin: { position: 'sidebar', description: 'Секция в навигацията, в която да се показва това пътуване' },
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
        { label: 'Archived', value: 'archived' },
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
          type: 'text',
        },
      ],
    },
    {
      name: 'whyVideos',
      type: 'array',
      admin: { description: 'Videos for the "Защо?" section (up to 2 shown as tilted cards)' },
      maxRows: 2,
      fields: [
        { name: 'video', type: 'upload', relationTo: 'media', required: true, filterOptions: { mimeType: { contains: 'video' } } },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'thumbnailAlt', type: 'text' },
        { name: 'label', type: 'text', admin: { description: 'Short caption shown on the card' } },
      ],
    },
    {
      name: 'whyImages',
      type: 'array',
      admin: { description: 'Images for the "Защо?" section (used when no videos are set)' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'whyTravelHeading',
      type: 'text',
      admin: { description: 'Heading for the "Why Travel With Us" bottom section' },
    },
    {
      name: 'whyTravelSubtext',
      type: 'textarea',
      admin: { description: 'Subtext paragraph for the "Why Travel With Us" bottom section' },
    },
    {
      name: 'whyTravelCtaLabel',
      type: 'text',
      admin: { description: 'Button label for the "Why Travel With Us" bottom section' },
    },
    {
      name: 'whyTravelCtaHref',
      type: 'text',
      admin: { description: 'Button URL for the "Why Travel With Us" bottom section' },
    },
    {
      name: 'whyTravelImages',
      type: 'array',
      admin: { description: 'Images for the "Why Travel With Us" bottom section. Use focal point to control crop position.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
        {
          name: 'focalPoint',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Top Left', value: 'top left' },
            { label: 'Top Right', value: 'top right' },
            { label: 'Bottom Left', value: 'bottom left' },
            { label: 'Bottom Right', value: 'bottom right' },
          ],
          admin: { description: 'Which part of the image to show when cropped' },
        },
        {
          name: 'focalX',
          type: 'number',
          min: 0,
          max: 100,
          admin: { description: 'Manual horizontal position (0–100%). Overrides focal point preset if set.' },
        },
        {
          name: 'focalY',
          type: 'number',
          min: 0,
          max: 100,
          admin: { description: 'Manual vertical position (0–100%). Overrides focal point preset if set.' },
        },
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
      type: 'array',
      admin: { description: 'Arc gauges — add, remove, or reorder freely. Value 0–100.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', min: 0, max: 100, defaultValue: 50, required: true },
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
            { name: 'transferStart', type: 'text', label: 'Отиване с автомобил', admin: { description: 'Времетраене при тръгване, напр. 3ч 20мин' } },
            { name: 'ascent', type: 'text', label: 'Изкачване' },
            { name: 'descent', type: 'text', label: 'Спускане' },
            { name: 'distance', type: 'text', label: 'Разстояние' },
            { name: 'duration', type: 'text', label: 'Време' },
            { name: 'accommodation', type: 'text', label: 'Настаняване' },
            { name: 'meals', type: 'text', label: 'Изхранване' },
            { name: 'transferEnd', type: 'text', label: 'Връщане с автомобил', admin: { description: 'Времетраене при връщане, напр. 3ч 20мин' } },
          ],
        },
      ],
    },
    {
      name: 'accommodationsSectionEyebrow',
      type: 'text',
      admin: { description: 'Small label above headline, e.g. ЗА НАСТАНЯВАНЕТО' },
    },
    {
      name: 'accommodationsSectionHeadline',
      type: 'text',
      admin: { description: 'Main heading for accommodations section' },
    },
    {
      name: 'accommodationsSectionSubtext',
      type: 'text',
      admin: { description: 'Subtext below the heading' },
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
    beforeChange: [
      ({ data }: { data: Record<string, unknown> }) => {
        const endDate = data.endDate as string | null
        if (!endDate || data.status === 'draft') return data
        const isPast = new Date(endDate) < new Date()
        if (isPast && data.status !== 'archived') {
          data.status = 'archived'
        } else if (!isPast && data.status === 'archived') {
          data.status = 'active'
        }
        return data
      },
    ],
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
