import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'
import { AboutHeroBlock } from '@/components/blocks/about/AboutHeroBlock'
import { AboutAdventureBlock } from '@/components/blocks/about/AboutAdventureBlock'
import { AboutWhoWeAreBlock } from '@/components/blocks/about/AboutWhoWeAreBlock'
import { AboutPartnersBlock } from '@/components/blocks/about/AboutPartnersBlock'
import { AboutEditButton } from './AboutEditButton'

const getAboutData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'about', depth: 2, overrideAccess: true })
    } catch {
      return null
    }
  },
  ['about-global'],
  { tags: ['about'], revalidate: 3600 },
)

export async function About() {
  const d = (await getAboutData()) as any

  const heroImageUrl = mediaUrl(typeof d?.heroImage === 'object' ? d?.heroImage?.url : null) ?? undefined
  const whoImage1Url = mediaUrl(typeof d?.whoImage1 === 'object' ? d?.whoImage1?.url : null) ?? undefined
  const whoImage2Url = mediaUrl(typeof d?.whoImage2 === 'object' ? d?.whoImage2?.url : null) ?? undefined
  const partners = (d?.partners ?? []).map((p: any) => ({
    name: p.name ?? '',
    url: p.url ?? '',
    logoUrl: mediaUrl(typeof p.logo === 'object' ? p.logo?.url : null),
  }))

  return (
    <>
      <AboutHeroBlock
        heroHeading={d?.heroHeading}
        heroSubtext={d?.heroSubtext}
        heroCtaLabel={d?.heroCtaLabel}
        heroCtaUrl={d?.heroCtaUrl}
        heroStatNumber={d?.heroStatNumber}
        heroStatLabel={d?.heroStatLabel}
        heroImageUrl={heroImageUrl}
      />
      <AboutAdventureBlock
        adventureHeading={d?.adventureHeading}
        adventureSubtext={d?.adventureSubtext}
        adventureActivities={d?.adventureActivities}
        adventureQuote={d?.adventureQuote}
        adventureQuoteBody={d?.adventureQuoteBody}
      />
      <AboutWhoWeAreBlock
        whoHeading={d?.whoHeading}
        whoDescription={d?.whoDescription}
        whoImage1Url={whoImage1Url}
        whoImage2Url={whoImage2Url}
      />
      <AboutPartnersBlock
        partnersHeading={d?.partnersHeading}
        partnersSubtext={d?.partnersSubtext}
        partnersCtaLabel={d?.partnersCtaLabel}
        partnersCtaUrl={d?.partnersCtaUrl}
        partners={partners}
      />
      <AboutEditButton />
    </>
  )
}
