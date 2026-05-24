import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag } from 'next/cache'

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
