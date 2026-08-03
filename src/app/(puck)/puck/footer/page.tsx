import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckFooterEditorClient } from './PuckFooterEditorClient'

export const dynamic = 'force-dynamic'

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
          subscribeHeading: f?.subscribeHeading ?? 'Subscribe',
          subscribeSubtext: f?.subscribeSubtext ?? 'Be the first to learn about upcoming journeys, special offers, and events.',
          submitLabel: f?.submitLabel ?? 'Subscribe',
          firstNamePlaceholder: f?.firstNamePlaceholder ?? 'First name',
          lastNamePlaceholder: f?.lastNamePlaceholder ?? 'Last name',
          emailPlaceholder: f?.emailPlaceholder ?? 'Email address',
          consentText: f?.consentText ?? 'By clicking subscribe, you agree to our',
          consentLinkText: f?.consentLinkText ?? 'Privacy Policy',
          privacyUrl: f?.privacyUrl ?? '/legal/privacy-policy',
        },
      },
      {
        type: 'FooterFollowBlock',
        props: {
          id: 'footer-follow',
          followHeading: f?.followHeading ?? 'Follow us!',
          followSubtext: f?.followSubtext ?? 'Be part of our community and follow our adventures.',
          facebookUrl: f?.facebookUrl ?? 'https://facebook.com/sonsofmountains',
          facebookFollowers: f?.facebookFollowers ?? '20.2K',
          instagramUrl: f?.instagramUrl ?? 'https://instagram.com/sonsofmountains',
          instagramFollowers: f?.instagramFollowers ?? '23.8K',
          tiktokUrl: f?.tiktokUrl ?? 'https://tiktok.com/@sonsofmountains',
          tiktokFollowers: f?.tiktokFollowers ?? '15.4K',
        },
      },
      {
        type: 'FooterTravelBlock',
        props: {
          id: 'footer-travel',
          travelSectionHeading: f?.travelSectionHeading ?? 'TRAVEL WITH US',
        },
      },
      {
        type: 'FooterNavBlock',
        props: {
          id: 'footer-nav',
          navSectionHeading: f?.navSectionHeading ?? 'NAVIGATION',
        },
      },
      {
        type: 'FooterBottomBlock',
        props: {
          id: 'footer-bottom',
          copyright: f?.copyright ?? '© 2018-2026 Sons of Mountains',
          licenseText: f?.licenseText ?? 'License Number: ',
          insuranceText: f?.insuranceText ?? 'Insurance Number: ',
          logoUrl,
          termsLabel: f?.termsLabel ?? 'Общи условия',
          termsUrl: f?.termsUrl ?? '/legal/terms',
          privacyLabel: f?.privacyLabel ?? 'Privacy Policy',
          privacyUrl: f?.privacyUrl ?? '/legal/privacy-policy',
          creditPrefix: f?.creditPrefix ?? 'Design and development by',
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
