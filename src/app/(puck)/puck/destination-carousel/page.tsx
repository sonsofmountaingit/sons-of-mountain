import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckDestinationCarouselEditorClient } from './PuckDestinationCarouselEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const c = (await payload.findGlobal({ slug: 'destination-carousel', depth: 2 })) as any
  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    limit: 50,
    sort: 'name',
    depth: 2,
  })

  const mappedDestinations = destinations.map((d: any) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    heroImage: typeof d.heroImage === 'object' ? d.heroImage : null,
  }))

  const introImageUrl = typeof c?.introSlideBackgroundImage === 'object' && c.introSlideBackgroundImage?.url
    ? c.introSlideBackgroundImage.url
    : ''

  const puckData: Data = c?.puckData?.content?.length
    ? {
        ...c.puckData,
        content: c.puckData.content.map((block: any) =>
          block.type === 'HomeDestCarouselBlock'
            ? {
                ...block,
                props: {
                  ...block.props,
                  headline: block.props.headline ?? c?.headline ?? 'Преоткривай света с нас!',
                  subheading: block.props.subheading ?? c?.subheading ?? 'Пътувай с Sons of Mountains там, където комфортът среща приключението.',
                  introSlideHeadline: block.props.introSlideHeadline ?? c?.introSlideHeadline ?? '',
                  introSlideSubheading: block.props.introSlideSubheading ?? c?.introSlideSubheading ?? '',
                  introSlideBackgroundImageUrl: block.props.introSlideBackgroundImageUrl ?? introImageUrl,
                  introSlideButtonText: block.props.introSlideButtonText ?? c?.introSlideButtonText ?? 'Разгледај',
                  destinationButtonText: block.props.destinationButtonText ?? c?.destinationButtonText ?? 'Разгледай',
                  destinations: mappedDestinations,
                },
              }
            : block
        ),
      }
    : {
        root: { props: {} },
        content: [
          {
            type: 'HomeDestCarouselBlock',
            props: {
              id: 'destination-carousel-main',
              sectionTitle: c?.sectionTitle ?? 'Дестинации',
              headline: c?.headline ?? 'Преоткривай света с нас!',
              subheading: c?.subheading ?? 'Пътувай с Sons of Mountains там, където комфортът среща приключението.',
              introSlideHeadline: c?.introSlideHeadline ?? '',
              introSlideSubheading: c?.introSlideSubheading ?? '',
              introSlideBackgroundImageUrl: introImageUrl,
              introSlideButtonText: c?.introSlideButtonText ?? 'Разгледај',
              destinationButtonText: c?.destinationButtonText ?? 'Разгледай',
              destinations: mappedDestinations,
            },
          },
        ],
      }

  return <PuckDestinationCarouselEditorClient initialData={puckData} />
}

export default function PuckDestinationCarouselEditorPage() {
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
