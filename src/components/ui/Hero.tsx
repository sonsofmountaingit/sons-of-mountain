import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroMainBlock } from '@/components/blocks/hero/HeroMainBlock'
import { HeroEditButton } from './HeroEditButton'

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
  const bgUrl = (typeof h?.backgroundImage === 'object' && h.backgroundImage?.url)
    ? h.backgroundImage.url
    : (h?.backgroundImageUrl ?? '')

  return (
    <>
      <HeroMainBlock
        headline={h?.headline ?? 'Преоткривай света с нас!'}
        subtext={h?.subtext ?? 'Пътувай с Panic Frame там, където комфортът среща приключението.'}
        ctaLabel={h?.ctaLabel ?? 'Виж всички дестинации'}
        ctaUrl={h?.ctaUrl ?? '/destinations'}
        backgroundImageUrl={bgUrl}
      />
      <HeroEditButton />
    </>
  )
}
