import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { revalidateGlobal } from '../hooks/revalidate'
import { after } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)
const revalidateAboutTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => {
      revalidateTag('about')
    })
  } catch { /* outside request scope */ }
  return doc
}

export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/AboutVisualEditorButton#AboutVisualEditorButton',
        },
      },
    },
    // Hero
    {
      name: 'heroHeading',
      type: 'text',
      defaultValue: 'Ние сме синовете на планините',
    },
    {
      name: 'heroSubtext',
      type: 'text',
      defaultValue: 'Организираме пътешествия до места, за които повечето хора само мечтаят.',
    },
    {
      name: 'heroCtaLabel',
      type: 'text',
      defaultValue: 'Разгледай пътуванията',
    },
    {
      name: 'heroCtaUrl',
      type: 'text',
      defaultValue: '/destinations',
    },
    {
      name: 'heroStatNumber',
      type: 'text',
      defaultValue: '4 200+',
    },
    {
      name: 'heroStatLabel',
      type: 'text',
      defaultValue: 'пътешественици с нас',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    // Adventure
    {
      name: 'adventureHeading',
      type: 'text',
      defaultValue: 'Хвърли се в приключение!',
    },
    {
      name: 'adventureSubtext',
      type: 'text',
      defaultValue: 'Не знаеш как? Спокой, ще ти дадем парашут или като минимум най-добрия маршрут!',
    },
    {
      name: 'adventureActivities',
      type: 'text',
      defaultValue: 'Каякинг · Риболов · Палатки · Хайкинг · Кемпер · Готвене на открито',
    },
    {
      name: 'adventureQuote',
      type: 'text',
      defaultValue: 'Не обичаме да ни слагат в рамки и all inclusive програми — обичаме ние да си избираме пътя, по който да минем.',
    },
    {
      name: 'adventureQuoteBody',
      type: 'text',
      defaultValue: 'Затова създадохме нашата нестандартна концепция — за да ви заведем там, където сме били лично и сме останали без думи.',
    },
    // Who We Are
    {
      name: 'whoHeading',
      type: 'text',
      defaultValue: 'Кои сме ние?',
    },
    {
      name: 'whoDescription',
      type: 'text',
      defaultValue: 'Ние сме приключенци като теб. Търсим нови изживявания в непознатото, организираме триповете си сами, пътуваме само с добри приятели.',
    },
    {
      name: 'whoImage1',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'whoImage2',
      type: 'upload',
      relationTo: 'media',
    },
    // Partners
    {
      name: 'partnersHeading',
      type: 'text',
      defaultValue: 'Нашите партньори',
    },
    {
      name: 'partnersSubtext',
      type: 'text',
      defaultValue: 'Колаборираме с любимите си брандове и медии',
    },
    {
      name: 'partnersCtaLabel',
      type: 'text',
      defaultValue: 'Стани наш партньор',
    },
    {
      name: 'partnersCtaUrl',
      type: 'text',
      defaultValue: '/contact',
    },
    {
      name: 'partners',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateAboutTag, revalidateGlobal('/about')],
  },
}
