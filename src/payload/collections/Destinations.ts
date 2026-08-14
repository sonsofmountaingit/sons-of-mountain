import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { scheduleStripeSync } from '@/lib/stripe-product-sync'
import { sendRegistrationFormsFor } from '@/lib/send-registration-forms'
import { paymentPlanFields } from './shared/paymentPlanFields'
import { bookingDeadlineField } from './shared/bookingDeadlineField'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'bookingStatus', 'startDate', 'endDate', 'type', 'updatedAt'],
    group: 'Пътувания',
  },
  access: {
    read: ({ req }) =>
      (req.user as { collection?: string } | undefined)?.collection === 'users'
        ? true
        : { _status: { equals: 'published' } },
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
      admin: {
        position: 'sidebar',
        description: 'Available places. Update manually when needed; Stripe-paid orders and active registrations adjust it automatically.',
      },
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
        { label: 'Archived', value: 'archived' },
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
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. Рила, България' },
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
      name: 'fitnessRatings',
      type: 'array',
      admin: { description: 'Arc gauges — add, remove, or reorder freely. Value 1–5.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', min: 1, max: 5, defaultValue: 3, required: true },
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
      admin: { position: 'sidebar', description: 'e.g. Африка — used in "Други преходи в Африка"' },
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
            { name: 'transferStart', type: 'text', label: 'Отиване с автомобил', admin: { description: 'Времетраене при тръгване, напр. 3ч 20мин' } },
            { name: 'ascent', type: 'text', label: 'Изкачване', admin: { description: 'e.g. 100м' } },
            { name: 'descent', type: 'text', label: 'Спускане', admin: { description: 'e.g. 100м' } },
            { name: 'distance', type: 'text', label: 'Разстояние', admin: { description: 'e.g. 5км' } },
            { name: 'duration', type: 'text', label: 'Време', admin: { description: 'e.g. 5ч' } },
            { name: 'accommodation', type: 'text', label: 'Настаняване', admin: { description: 'e.g. Хотел' } },
            { name: 'meals', type: 'text', label: 'Изхранване', admin: { description: 'e.g. Обяд и вечеря' } },
            { name: 'transferEnd', type: 'text', label: 'Връщане с автомобил', admin: { description: 'Времетраене при връщане, напр. 3ч 20мин' } },
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
          admin: { description: 'Щом се попълни, автоматично се изпраща формулярът за записване на всички вече записани (спазвайки правилата за дни).' },
        },
      ],
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
  ],
  hooks: {
    beforeChange: [
      ({ data }: { data: Record<string, unknown> }) => {
        const endDate = data.endDate as string | null
        if (!endDate) return data
        const isPast = new Date(endDate) < new Date()
        if (isPast && data.bookingStatus !== 'archived') {
          data.bookingStatus = 'archived'
        } else if (!isPast && data.bookingStatus === 'archived') {
          data.bookingStatus = 'active'
        }
        return data
      },
    ],
    afterChange: [
      revalidateCollection('destinations', '/destinations', ['featured-travels']),
      ({ doc, previousDoc, req }) => {
        scheduleStripeSync({ doc, previousDoc, payload: req.payload, collection: 'destinations', priceField: 'price' })
      },
      async ({ doc, previousDoc, req }) => {
        const peak = doc.freeTransfer?.peak
        const previousPeak = previousDoc?.freeTransfer?.peak
        if (peak && !previousPeak) {
          try {
            await sendRegistrationFormsFor({ payload: req.payload, destinationId: doc.id })
          } catch (err) {
            console.error(`Failed sending registration forms for destination ${doc.id}:`, err)
          }
        }
      },
    ],
    afterDelete: [revalidateCollectionDelete('destinations', '/destinations', ['featured-travels'])],
  },
}
