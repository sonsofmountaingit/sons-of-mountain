import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'subscriptionHeading',
      type: 'text',
      defaultValue: 'Абонирай се — Научавай първи за предстоящи пътешествия, отстъпки и събития.',
    },
    {
      name: 'instagramUrl',
      type: 'text',
    },
    {
      name: 'facebookUrl',
      type: 'text',
    },
    {
      name: 'travelLinks',
      type: 'array',
      label: 'Пътувай с нас (Travel Links)',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'logoGif',
      type: 'text',
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
      name: 'credit',
      type: 'text',
      defaultValue: 'Дизайн и разработка от KICKFLIP',
    },
    {
      name: 'creditUrl',
      type: 'text',
      defaultValue: 'https://kickflip.design',
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal('/')],
  },
}
