import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckAboutEditorClient } from './PuckAboutEditorClient'
import { mediaUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'about', depth: 2 })) as any

  const heroImageUrl = mediaUrl(typeof d?.heroImage === 'object' ? d?.heroImage?.url : null) ?? ''
  const whoImage1Url = mediaUrl(typeof d?.whoImage1 === 'object' ? d?.whoImage1?.url : null) ?? ''
  const whoImage2Url = mediaUrl(typeof d?.whoImage2 === 'object' ? d?.whoImage2?.url : null) ?? ''
  const partners = (d?.partners ?? []).map((p: any) => ({
    name: p.name ?? '',
    url: p.url ?? '',
    logoUrl: mediaUrl(typeof p.logo === 'object' ? p.logo?.url : null),
  }))

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'AboutHeroBlock',
        props: {
          id: 'about-hero',
          heroHeading: d?.heroHeading ?? 'Ние сме синовете на планините',
          heroSubtext: d?.heroSubtext ?? 'Организираме пътешествия до места, за които повечето хора само мечтаят.',
          heroCtaLabel: d?.heroCtaLabel ?? 'Разгледай пътуванията',
          heroCtaUrl: d?.heroCtaUrl ?? '/destinations',
          heroStatNumber: d?.heroStatNumber ?? '4 200+',
          heroStatLabel: d?.heroStatLabel ?? 'пътешественици с нас',
          heroImageUrl,
        },
      },
      {
        type: 'AboutAdventureBlock',
        props: {
          id: 'about-adventure',
          adventureHeading: d?.adventureHeading ?? 'Хвърли се в приключение!',
          adventureSubtext: d?.adventureSubtext ?? 'Не знаеш как? Спокой, ще ти дадем парашут или като минимум най-добрия маршрут!',
          adventureActivities: d?.adventureActivities ?? 'Каякинг · Риболов · Палатки · Хайкинг · Кемпер · Готвене на открито',
          adventureQuote: d?.adventureQuote ?? 'Не обичаме да ни слагат в рамки и all inclusive програми.',
          adventureQuoteBody: d?.adventureQuoteBody ?? 'Затова създадохме нашата нестандартна концепция.',
        },
      },
      {
        type: 'AboutWhoWeAreBlock',
        props: {
          id: 'about-who',
          whoHeading: d?.whoHeading ?? 'Кои сме ние?',
          whoDescription: d?.whoDescription ?? 'Ние сме приключенци като теб.',
          whoImage1Url,
          whoImage2Url,
        },
      },
      {
        type: 'AboutPartnersBlock',
        props: {
          id: 'about-partners',
          partnersHeading: d?.partnersHeading ?? 'Нашите партньори',
          partnersSubtext: d?.partnersSubtext ?? 'Колаборираме с любимите си брандове и медии',
          partnersCtaLabel: d?.partnersCtaLabel ?? 'Стани наш партньор',
          partnersCtaUrl: d?.partnersCtaUrl ?? '/contact',
          partners,
        },
      },
    ],
  }

  return <PuckAboutEditorClient initialData={puckData} />
}

export default function PuckAboutEditorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading Visual Editor…
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
