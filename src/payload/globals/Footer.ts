import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { revalidateGlobal } from '../hooks/revalidate'
import { after } from 'next/server'

const revalidateFooterTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => {
      revalidateTag('footer')
    })
  } catch { /* outside request scope */ }
  return doc
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'subscribeHeading',
      type: 'text',
      defaultValue: 'Абонирай се',
    },
    {
      name: 'subscribeSubtext',
      type: 'text',
      defaultValue: 'Научавай първи за предстоящи пътешествия, отстъпки и събития.',
    },
    {
      name: 'subscriptionHeading',
      type: 'text',
      defaultValue: 'Абонирай се — Научавай първи за предстоящи пътешествия, отстъпки и събития.',
      admin: { hidden: true },
    },
    {
      name: 'followHeading',
      type: 'text',
      defaultValue: 'Последвай ни!',
    },
    {
      name: 'followSubtext',
      type: 'text',
      defaultValue: 'Стани част от нашата общност и следи приключенията ни отблизо.',
    },
    {
      name: 'facebookFollowers',
      type: 'text',
      defaultValue: '20.2K',
    },
    {
      name: 'instagramFollowers',
      type: 'text',
      defaultValue: '23.8K',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      defaultValue: 'https://instagram.com/panicframe',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      defaultValue: 'https://facebook.com/panicframe',
    },
    {
      name: 'travelSectionHeading',
      type: 'text',
      defaultValue: 'ПЪТУВАЙ С НАС',
    },
    {
      name: 'navSectionHeading',
      type: 'text',
      defaultValue: 'НАВИГАЦИЯ',
    },
    {
      name: 'termsUrl',
      type: 'text',
      defaultValue: '/legal/terms',
    },
    {
      name: 'termsLabel',
      type: 'text',
      defaultValue: 'Общи условия',
    },
    {
      name: 'privacyUrl',
      type: 'text',
      defaultValue: '/legal/cookies',
    },
    {
      name: 'privacyLabel',
      type: 'text',
      defaultValue: 'Политика за поверителност',
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Абонирай се',
    },
    {
      name: 'firstNamePlaceholder',
      type: 'text',
      defaultValue: 'Име',
    },
    {
      name: 'lastNamePlaceholder',
      type: 'text',
      defaultValue: 'Фамилия',
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      defaultValue: 'E-mail адрес',
    },
    {
      name: 'consentText',
      type: 'text',
      defaultValue: 'С натискането на бутона "Абонирай се" се съгласяваш с',
    },
    {
      name: 'consentLinkText',
      type: 'text',
      defaultValue: 'Политиката ни за поверителност',
    },
    {
      name: 'travelLinkSource',
      type: 'select',
      label: 'Пътувай с нас — Източник',
      defaultValue: 'auto',
      options: [
        { label: 'Автоматично (всички активни пътувания по дата)', value: 'auto' },
        { label: 'Ръчно избрани пътувания', value: 'manual' },
      ],
    },
    {
      name: 'selectedTrips',
      type: 'array',
      label: 'Избрани пътувания (ръчно)',
      admin: {
        condition: (_, siblingData) => siblingData?.travelLinkSource === 'manual',
      },
      fields: [
        {
          name: 'trip',
          type: 'relationship',
          relationTo: 'trips',
          required: true,
        },
      ],
    },
    {
      name: 'navLinkSource',
      type: 'select',
      label: 'Навигация — Източник',
      defaultValue: 'auto',
      options: [
        { label: 'Автоматично (от Navigation глобал)', value: 'auto' },
        { label: 'Ръчно въведени', value: 'manual' },
      ],
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Навигация (ръчно)',
      admin: {
        condition: (_, siblingData) => siblingData?.navLinkSource === 'manual',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'logoGif',
      type: 'text',
      label: 'Logo URL (fallback)',
      admin: { hidden: true },
      defaultValue: 'https://framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png',
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2018-2026 Паник Фрейм енд Травел',
    },
    {
      name: 'licenseText',
      type: 'text',
      defaultValue: 'Номер на лиценз: РК-01-8245 / 28.07.2022',
    },
    {
      name: 'licenseUrl',
      type: 'text',
    },
    {
      name: 'insuranceText',
      type: 'text',
      defaultValue: 'Номер на застрахователна полица: 03700100005995 / 31.08.2025',
    },
    {
      name: 'insuranceUrl',
      type: 'text',
    },
    {
      name: 'creditPrefix',
      type: 'text',
      defaultValue: 'Дизайн и разработка от',
    },
    {
      name: 'creditName',
      type: 'text',
      defaultValue: 'Netinsky',
    },
    {
      name: 'creditUrl',
      type: 'text',
      defaultValue: 'https://netinsky.com',
    },
    {
      name: 'credit',
      type: 'text',
      admin: { hidden: true },
      defaultValue: 'Дизайн и разработка от Netinsky',
    },
  ],
  hooks: {
    afterChange: [revalidateFooterTag, revalidateGlobal('/')],
  },
}
