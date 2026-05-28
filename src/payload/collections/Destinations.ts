import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { after } from 'next/server'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'updatedAt'],
    group: 'Пътувания',
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'В България', value: 'bulgaria' },
        { label: 'В чужбина', value: 'abroad' },
      ],
      defaultValue: 'bulgaria',
      required: true,
      admin: { position: 'sidebar', description: 'Used to categorise the destination in the navigation megamenu' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional background video (mp4). If set, plays instead of the hero image.' },
    },
    {
      name: 'heroGallery',
      type: 'array',
      admin: { description: 'Additional images shown as thumbnails at the bottom-right of the hero.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'month',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. юли — typical month(s) this destination runs' },
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      admin: { position: 'sidebar', description: 'Starting price in EUR (shown on cards)' },
    },
    {
      name: 'availableSpots',
      type: 'number',
      min: 0,
      admin: { position: 'sidebar', description: 'Leave empty to hide the badge' },
    },
    {
      name: 'durationDays',
      type: 'number',
      admin: { position: 'sidebar', description: 'Typical trip duration in days' },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'priceIncludes',
      type: 'textarea',
      admin: { description: 'Short subtitle under price, e.g. "Включва самолетни билети, всички нощувки..."' },
    },
    {
      name: 'depositAmount',
      type: 'number',
      admin: { position: 'sidebar', description: 'Deposit amount to reserve a spot' },
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
      defaultValue: 12,
      admin: { position: 'sidebar' },
    },
    {
      name: 'spotsAvailable',
      type: 'number',
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
      name: 'bookingStatus',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Sold Out', value: 'soldOut' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
      defaultValue: 'active',
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'endDate',
      type: 'date',
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
    {
      name: 'introText',
      type: 'textarea',
      required: true,
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
      name: 'whyVisit',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'richText' },
      ],
    },
    {
      name: 'whyVideos',
      type: 'array',
      admin: { description: 'Videos shown in the "Защо?" section.' },
      fields: [
        { name: 'video', type: 'upload', relationTo: 'media', required: true },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'label', type: 'text' },
      ],
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
      name: 'whyImage',
      type: 'upload',
      relationTo: 'media',
      admin: { hidden: true, description: 'Legacy — use whyImages instead' },
    },
    {
      name: 'whyImages',
      type: 'array',
      admin: { description: 'Images for the "Защо?" section — cycles automatically every 4s' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'fitnessSummaryHeading',
      type: 'text',
      admin: { description: 'Heading under fitness gauges, e.g. "Готов ли си за среща с дивото?"' },
    },
    {
      name: 'fitnessSummaryText',
      type: 'richText',
    },
    {
      name: 'travelTitle',
      type: 'text',
      admin: { description: 'Heading for the "Пътуването" block' },
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
      admin: { description: 'Heading for the "Придвижването" block' },
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
      name: 'accommodations',
      type: 'array',
      fields: [
        { name: 'locationLabel', type: 'text', admin: { description: 'e.g. НАЦИОНАЛЕН ПАРК КУИН ЕЛИЗАБЕТ' } },
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
      admin: { description: 'Traveler avatar photos for the community grid' },
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'continent',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. Африка — used in "Други пътешествия в Африка"' },
    },
    {
      name: 'departureCity',
      type: 'text',
      admin: { position: 'sidebar', description: 'e.g. София — shown in hero as "Излита от София"' },
    },
    {
      name: 'tags',
      type: 'array',
      admin: { description: 'Tag chips shown in hero e.g. Фотография, Природа, Горила трекинг' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'groupPhoto',
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
      name: 'latitude',
      type: 'number',
      admin: { position: 'sidebar', description: 'Map latitude' },
    },
    {
      name: 'longitude',
      type: 'number',
      admin: { position: 'sidebar', description: 'Map longitude' },
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
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      revalidateCollection('destinations', '/destinations'),
      async ({ doc, previousDoc, req }) => {
        try {
          after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'destinations', priceField: 'price' }))
        } catch {
          await syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'destinations', priceField: 'price' })
        }
      },
    ],
    afterDelete: [revalidateCollectionDelete('destinations', '/destinations')],
  },
}
