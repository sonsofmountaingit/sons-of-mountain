import type { CollectionConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { syncStripeProduct } from '@/lib/stripe-product-sync'
import { paymentPlanFields } from './shared/paymentPlanFields'
import { bookingDeadlineField } from './shared/bookingDeadlineField'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag
const revalidatePrograms = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('programs', 'max'); revalidateTag('megamenu', 'max'); revalidateTag('featured-travels', 'max') }) } catch { /* noop */ }
  return doc
}
const revalidateProgramsDelete = () => {
  try { after(() => { revalidateTag('programs', 'max'); revalidateTag('megamenu', 'max'); revalidateTag('featured-travels', 'max') }) } catch { /* noop */ }
}

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'startDate', 'endDate', 'type', 'price'],
    group: 'Пътувания',
  },
  access: {
    read: ({ req }) =>
      (req.user as { collection?: string } | undefined)?.collection === 'users'
        ? true
        : { status: { not_equals: 'draft' } },
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
        { label: 'Индивидуални програми', value: 'individual' },
      ],
      admin: { position: 'sidebar', description: 'Секция в навигацията, в която да се показва тази програма' },
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
      admin: { position: 'sidebar', description: 'Deposit amount to reserve a spot' },
    },
    bookingDeadlineField,
    ...paymentPlanFields,
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
      name: 'earlyBirdSpotsRemaining',
      type: 'number',
      admin: {
        description: 'Early bird spots left to sell at the discounted price. Auto-decrements on purchase; leave blank to reset to Number of early bird spots.',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) => (value == null ? siblingData.earlyBirdSpots ?? null : value),
        ],
      },
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
    // Stripe — auto-managed
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
    // Dates
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'endDate',
      type: 'date',
    },
    // Content
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
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
      admin: { description: 'e.g. Банско, България' },
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
      name: 'bookingStep1',
      type: 'textarea',
      admin: { description: 'Booking process — step 01 text. Leave empty to hide the step.' },
    },
    {
      name: 'bookingStep2',
      type: 'textarea',
      admin: { description: 'Booking process — step 02 text. Leave empty to hide the step.' },
    },
    {
      name: 'bookingStep3',
      type: 'textarea',
      admin: { description: 'Booking process — step 03 text. Leave empty to hide the step.' },
    },
    {
      name: 'itinerary',
      type: 'array',
      admin: { description: 'Sample itinerary' },
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
            { name: 'transferStart', type: 'text', label: 'Пътуване', admin: { description: 'Времетраене при тръгване, напр. 3ч 20мин' } },
            { name: 'ascent', type: 'text', label: 'Изкачване', admin: { description: 'e.g. 100м' } },
            { name: 'descent', type: 'text', label: 'Спускане', admin: { description: 'e.g. 100м' } },
            { name: 'distance', type: 'text', label: 'Разстояние', admin: { description: 'e.g. 5км' } },
            { name: 'duration', type: 'text', label: 'Време', admin: { description: 'e.g. 5ч' } },
            { name: 'accommodation', type: 'text', label: 'Настаняване', admin: { description: 'e.g. Хотел' } },
            { name: 'meals', type: 'text', label: 'Изхранване', admin: { description: 'e.g. Обяд и вечеря' } },
            { name: 'transferEnd', type: 'text', label: 'Пътуване', admin: { description: 'Времетраене при връщане, напр. 3ч 20мин' } },
          ],
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
      name: 'whyVideos',
      type: 'array',
      maxRows: 2,
      admin: { description: 'Videos for the "Защо?" section (up to 2 shown as tilted cards)' },
      fields: [
        { name: 'video', type: 'upload', relationTo: 'media', required: true, filterOptions: { mimeType: { contains: 'video' } } },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        { name: 'thumbnailAlt', type: 'text' },
        { name: 'label', type: 'text', admin: { description: 'Short caption shown on the card' } },
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
          admin: { description: 'Manual horizontal position (0–100%). Overrides focal point preset if set.' },
        },
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
      admin: { description: 'Arc gauges — add, remove, or reorder freely. Value 1–5.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', min: 1, max: 5, defaultValue: 3, required: true },
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
      name: 'transportMapLink',
      type: 'text',
      admin: { description: 'Google Maps link (Придвижването block) — shows distance/time on click' },
    },
    {
      name: 'transportImage',
      type: 'upload',
      relationTo: 'media',
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
      name: 'freeTransfer',
      type: 'group',
      label: 'Безплатен Преход',
      admin: { description: 'Показва се над секцията за резервация само ако заглавието и текстът са попълнени.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Снимка' },
        { name: 'headline', type: 'text', label: 'Заглавие' },
        { name: 'paragraph', type: 'textarea', label: 'Текст' },
        { name: 'smallSpanText', type: 'text', label: 'Малък надпис' },
        { name: 'departureDate', type: 'date', label: 'Дата на тръгване', admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'departureTime', type: 'text', label: 'Час на тръгване', admin: { placeholder: '09:30' } },
        { name: 'returnDate', type: 'date', label: 'Крайна дата на прехода', admin: { date: { pickerAppearance: 'dayOnly' }, description: 'Ако е попълнена, се показва диапазон (от – до), за да е ясно че прехода не е еднодневен.' } },
        {
          name: 'peak',
          type: 'text',
          label: 'Връх',
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
      name: 'instructor',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
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
      name: 'continent',
      type: 'text',
      admin: { position: 'sidebar' },
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
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea', label: 'Мета описание на страницата', admin: { description: 'Мета описание на страниците. OG изображението се брандира автоматично (снимка + бяло лого).' } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Ако е зададена, се използва за OG изображението с автоматично добавено бяло лого отгоре.' } },
        { name: 'keywords', type: 'text', admin: { description: 'Comma-separated keywords' } },
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
      revalidatePrograms,
      async ({ doc, previousDoc, req }) => {
        try {
          after(() => syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'programs', priceField: 'price' }))
        } catch {
          await syncStripeProduct({ doc, previousDoc, payload: req.payload, collection: 'programs', priceField: 'price' })
        }
      },
    ],
    afterDelete: [revalidateProgramsDelete],
  },
}
