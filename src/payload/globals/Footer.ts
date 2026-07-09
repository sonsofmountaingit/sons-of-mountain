import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { revalidateGlobal } from '../hooks/revalidate'
import { after } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag
const revalidateFooterTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { try { revalidateTag('footer', 'max') } catch {} })
  } catch { /* outside request scope */ }
  return doc
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/FooterVisualEditorButton#FooterVisualEditorButton',
        },
      },
    },
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
      defaultValue: 'https://instagram.com/sonsofmountains',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      defaultValue: 'https://facebook.com/sonsofmountains',
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
        { label: 'Автоматично (пътувания + програми по дата)', value: 'autoWithPrograms' },
        { label: 'Ръчно избрани', value: 'manual' },
      ],
    },
    {
      name: 'selectedTrips',
      type: 'array',
      label: 'Избрани пътувания / програми (ръчно)',
      admin: {
        condition: (_, siblingData) => siblingData?.travelLinkSource === 'manual',
      },
      fields: [
        {
          name: 'trip',
          type: 'relationship',
          relationTo: ['trips', 'programs'],
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
        description: 'Избери линк от Navigation глобала или задай ръчно label/href.',
      },
      fields: [
        {
          name: 'sourceLink',
          type: 'select',
          label: 'Линк от Навигация',
          options: [
            { label: 'Линк 1', value: '0' },
            { label: 'Линк 2', value: '1' },
            { label: 'Линк 3', value: '2' },
            { label: 'Линк 4', value: '3' },
            { label: 'Линк 5', value: '4' },
            { label: 'Линк 6', value: '5' },
            { label: 'Линк 7', value: '6' },
            { label: 'Линк 8', value: '7' },
          ],
          admin: { description: 'Съответства на реда на линковете в Site Settings → Navigation (Left + Right, в реда, в който излизат в менюто).' },
        },
        { name: 'label', type: 'text', admin: { description: 'Оставѝ празно, за да ползваш label от Навигация.' } },
        { name: 'href', type: 'text', admin: { description: 'Оставѝ празно, за да ползваш href от Навигация.' } },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (white)',
    },
    {
      name: 'logoColored',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (colored, shown on hover)',
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
      defaultValue: '© 2018-2026 Сонс оф Моунтаин',
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
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateFooterTag, revalidateGlobal('/')],
  },
}
