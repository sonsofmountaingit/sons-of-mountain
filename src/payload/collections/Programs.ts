import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { syncStripeProduct } from '@/lib/stripe-product-sync'

const revalidatePrograms = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('programs', 'default') }) } catch { /* noop */ }
  return doc
}
const revalidateProgramsDelete = () => {
  try { after(() => { revalidateTag('programs', 'default') }) } catch { /* noop */ }
}

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', 'status', 'spotsAvailable'],
    group: 'Пътувания',
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
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Yoga', value: 'Yoga' },
        { label: 'Ski', value: 'Ski' },
        { label: 'Photography', value: 'Photography' },
        { label: 'Sailing', value: 'Sailing' },
        { label: 'Hiking', value: 'Hiking' },
        { label: 'Cultural', value: 'Cultural' },
        { label: 'Wellness', value: 'Wellness' },
        { label: 'Adventure', value: 'Adventure' },
        { label: 'Other', value: 'Other' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
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
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. Банско, България' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
    },
    {
      name: 'spotsTotal',
      type: 'number',
      defaultValue: 12,
    },
    {
      name: 'spotsAvailable',
      type: 'number',
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
          options: ['Singles Only', 'Family', 'Couples', 'Photography', 'Yoga', 'Ski', 'Sailing', 'Adventure', 'Wellness', 'Hiking', 'Cultural'],
        },
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
      name: 'priceIncludes',
      type: 'textarea',
    },
    {
      name: 'communityPhotos',
      type: 'array',
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'continent',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'instructor',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'earlyBirdPrice',
      type: 'number',
    },
    {
      name: 'earlyBirdUntil',
      type: 'date',
    },
    {
      name: 'earlyBirdSpots',
      type: 'number',
    },
    {
      name: 'maxParticipantsPerRegistration',
      type: 'number',
      defaultValue: 4,
    },
    {
      name: 'latitude',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'longitude',
      type: 'number',
      admin: { position: 'sidebar' },
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
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'photographer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Photographer/creator for this program' },
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
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
      revalidatePrograms,
      async ({ doc, previousDoc, req }) => {
        after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'programs', priceField: 'price' }))
      },
    ],
    afterDelete: [revalidateProgramsDelete],
  },
}
