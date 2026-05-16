import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

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
      ],
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
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidatePrograms],
    afterDelete: [revalidateProgramsDelete],
  },
}
