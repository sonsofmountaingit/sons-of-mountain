import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)

export const WhyTravelWithUs: GlobalConfig = {
  slug: 'why-travel-with-us',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/WhyTravelWithUsVisualEditorButton#WhyTravelWithUsVisualEditorButton',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'ЗАЩО ДА ПЪТУВАШ С НАС?',
    },
    {
      name: 'items',
      type: 'array',
      defaultValue: [
        { icon: 'globe', title: 'Отвъд познатото', body: 'Откриваш нови места и разширяваш хоризонтите си.' },
        { icon: 'camera', title: 'Общност от активни хора', body: 'Срещаш приятели със същата любов и страст към планината.' },
        { icon: 'city', title: 'Потапяне в природата', body: 'Преживявания, след които се връщаш дълбоко променен.' },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Camera', value: 'camera' },
            { label: 'Globe / Community', value: 'globe' },
            { label: 'City / Meaning', value: 'city' },
          ],
        },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Научи повече' },
    { name: 'ctaHref', type: 'text', defaultValue: '/about' },
    {
      name: 'videoCards',
      type: 'array',
      label: 'Video Cards',
      maxRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'video', type: 'upload', relationTo: 'media', required: true },
        { name: 'poster', type: 'upload', relationTo: 'media' },
        { name: 'price', type: 'number', defaultValue: 0 },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'EUR',
          options: [
            { label: 'EUR (€)', value: 'EUR' },
            { label: 'USD ($)', value: 'USD' },
            { label: 'BGN (лв.)', value: 'BGN' },
          ],
        },
        { name: 'spotsAvailable', type: 'number' },
        { name: 'difficulty', type: 'number', min: 0, max: 100 },
        { name: 'depositAmount', type: 'number' },
        { name: 'startDate', type: 'date' },
        { name: 'endDate', type: 'date' },
        { name: 'durationDays', type: 'number' },
        { name: 'month', type: 'text' },
        {
          name: 'itemType',
          type: 'select',
          defaultValue: 'trip',
          options: [
            { label: 'Trip', value: 'trip' },
            { label: 'Destination', value: 'destination' },
            { label: 'Program', value: 'program' },
          ],
        },
        { name: 'tripId', type: 'text', admin: { description: 'ID used for booking (trip or program)' } },
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
      ({ doc }) => {
        try {
          after(() => revalidateTag('why-travel-with-us'))
        } catch { /* outside request scope */ }
        return doc
      },
    ],
  },
}
