import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NavbarClient } from './NavbarClient'
import { NavigationEditButton } from './NavigationEditButton'

const getNavigationData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const data = await payload.findGlobal({ slug: 'navigation', depth: 2 })
      const d = data as any
      return {
        navLinksLeft: (d?.navLinksLeft ?? []) as { label: string; href: string }[],
        navLinksRight: (d?.navLinksRight ?? []) as { label: string; href: string }[],
        instagramUrl: (d?.instagramUrl ?? 'https://instagram.com/panicframe') as string,
        facebookUrl: (d?.facebookUrl ?? 'https://facebook.com/panicframe') as string,
        tiktokUrl: (d?.tiktokUrl ?? '') as string,
        logoDarkUrl: (typeof d?.logoDark === 'object' ? d.logoDark?.url : null) ?? 'https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png',
        logoLightUrl: (typeof d?.logoLight === 'object' ? d.logoLight?.url : null) ?? '',
      }
    } catch {
      return {
        navLinksLeft: [
          { label: 'КАЛЕНДАР', href: '/calendar' },
          { label: 'ГАЛЕРИЯ', href: '/gallery' },
        ],
        navLinksRight: [
          { label: 'БЛОГ', href: '/blog' },
          { label: 'ЗА НАС', href: '/about' },
          { label: 'КОНТАКТИ', href: '/contact' },
        ],
        instagramUrl: 'https://instagram.com/panicframe',
        facebookUrl: 'https://facebook.com/panicframe',
        tiktokUrl: '',
        logoDarkUrl: 'https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png',
        logoLightUrl: '',
      }
    }
  },
  ['navigation-global'],
  { tags: ['navigation'], revalidate: 3600 },
)

export async function Navigation() {
  const data = await getNavigationData()
  return (
    <>
      <NavbarClient {...data} />
      <NavigationEditButton />
    </>
  )
}
