import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckFooterEditorClient } from './PuckFooterEditorClient'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const f = (await payload.findGlobal({ slug: 'footer', depth: 2 })) as any
  const logoUrl = (typeof f?.logo === 'object' && f?.logo?.url) ? f.logo.url : (f?.logoGif ?? 'https://framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png')

  const puckData: Data = f?.puckData?.content?.length ? f.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'FooterSubscribeBlock',
        props: {
          id: 'footer-subscribe',
          subscribeHeading: f?.subscribeHeading ?? 'Абонирай се',
          subscribeSubtext: f?.subscribeSubtext ?? 'Научавай първи за предстоящи пътешествия, отстъпки и събития.',
          submitLabel: f?.submitLabel ?? 'Абонирай се',
          firstNamePlaceholder: f?.firstNamePlaceholder ?? 'Име',
          lastNamePlaceholder: f?.lastNamePlaceholder ?? 'Фамилия',
          emailPlaceholder: f?.emailPlaceholder ?? 'E-mail адрес',
          consentText: f?.consentText ?? 'С натискането на бутона "Абонирай се" се съгласяваш с',
          consentLinkText: f?.consentLinkText ?? 'Политиката ни за поверителност',
          privacyUrl: f?.privacyUrl ?? '/legal/cookies',
        },
      },
      {
        type: 'FooterFollowBlock',
        props: {
          id: 'footer-follow',
          followHeading: f?.followHeading ?? 'Последвай ни!',
          followSubtext: f?.followSubtext ?? 'Стани част от нашата общност и следи приключенията ни отблизо.',
          facebookUrl: f?.facebookUrl ?? 'https://facebook.com/panicframe',
          facebookFollowers: f?.facebookFollowers ?? '20.2K',
          instagramUrl: f?.instagramUrl ?? 'https://instagram.com/panicframe',
          instagramFollowers: f?.instagramFollowers ?? '23.8K',
        },
      },
      {
        type: 'FooterTravelBlock',
        props: {
          id: 'footer-travel',
          travelSectionHeading: f?.travelSectionHeading ?? 'ПЪТУВАЙ С НАС',
        },
      },
      {
        type: 'FooterNavBlock',
        props: {
          id: 'footer-nav',
          navSectionHeading: f?.navSectionHeading ?? 'НАВИГАЦИЯ',
        },
      },
      {
        type: 'FooterBottomBlock',
        props: {
          id: 'footer-bottom',
          copyright: f?.copyright ?? '© 2018-2026 Паник Фрейм енд Травел',
          licenseText: f?.licenseText ?? 'Номер на лиценз: РК-01-8245 / 28.07.2022',
          insuranceText: f?.insuranceText ?? 'Номер на застрахователна полица: 03700100005995 / 31.08.2025',
          logoUrl,
          termsLabel: f?.termsLabel ?? 'Общи условия',
          termsUrl: f?.termsUrl ?? '/legal/terms',
          privacyLabel: f?.privacyLabel ?? 'Политика за поверителност',
          privacyUrl: f?.privacyUrl ?? '/legal/cookies',
          creditPrefix: f?.creditPrefix ?? 'Дизайн и разработка от',
          creditName: f?.creditName ?? 'Netinsky',
          creditUrl: f?.creditUrl ?? 'https://netinsky.com',
        },
      },
    ],
  }

  return <PuckFooterEditorClient initialData={puckData} />
}

export default function PuckFooterEditorPage() {
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
