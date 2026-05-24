import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { WhyTravelWithUsBlock } from '@/components/blocks/why-travel-with-us/WhyTravelWithUsBlock'
import { WhyTravelWithUsEditButton } from './WhyTravelWithUsEditButton'

const getData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'why-travel-with-us', depth: 0, overrideAccess: true }) as Promise<any>
  },
  ['why-travel-with-us'],
  { tags: ['why-travel-with-us'], revalidate: 3600 },
)

export async function WhyTravelWithUs() {
  const g = await getData()

  const heading = g?.heading ?? 'ЗАЩО ДА ПЪТУВАШ С НАС?'
  const ctaLabel = g?.ctaLabel ?? 'Научи повече'
  const ctaHref = g?.ctaHref ?? '/about'
  const items = g?.items ?? [
    { icon: 'camera', title: 'Автентичност', body: 'Пътувания, в които се сливаш с мястото, не просто го снимаш.' },
    { icon: 'globe', title: 'Общност', body: 'Малки групи от хора със сходен дух и жажда за приключения.' },
    { icon: 'city', title: 'Смисъл', body: 'Моменти, които остават в съзнанието дълго след като се приберeш.' },
  ]

  return (
    <>
      <WhyTravelWithUsBlock heading={heading} items={items} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <WhyTravelWithUsEditButton />
    </>
  )
}
