import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PuckRender } from '@/components/blocks/PuckRender'
import { HeroMainBlock } from '@/components/blocks/hero/HeroMainBlock'
import { HeroHeadlineBlock } from '@/components/blocks/hero/HeroHeadlineBlock'
import { HeroSubtextBlock } from '@/components/blocks/hero/HeroSubtextBlock'
import { HeroCtaBlock } from '@/components/blocks/hero/HeroCtaBlock'
import { HeroEditButton } from './HeroEditButton'
import type { Data } from '@puckeditor/core'

const getHeroData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'hero', depth: 2 })
    } catch {
      return null
    }
  },
  ['hero-global'],
  { tags: ['hero'], revalidate: 3600 },
)

export async function Hero() {
  const h = await getHeroData()
  const puckData: Data | null = h?.puckData?.content?.length ? h.puckData as Data : null

  if (puckData) {
    return (
      <>
        <PuckRender data={puckData} />
        <HeroEditButton />
      </>
    )
  }

  return (
    <>
      <HeroMainBlock backgroundVideoUrl="/hero-bg.mp4">
        <HeroHeadlineBlock text={h?.headline ?? 'Преоткривай света с нас!'} />
        <HeroSubtextBlock text={h?.subtext ?? 'Пътувай с Panic Frame там, където комфортът среща приключението.'} />
        <HeroCtaBlock label={h?.ctaLabel ?? 'Виж всички дестинации'} url={h?.ctaUrl ?? '/destinations'} />
      </HeroMainBlock>
      <HeroEditButton />
    </>
  )
}
