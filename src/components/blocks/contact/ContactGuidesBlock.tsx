import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactGuidesBlockRenderer } from './ContactGuidesBlockRenderer'

type Guide = {
  id: string
  name: string
  instagram?: string | null
  photo?: { url?: string | null } | null
}

const FEATURED_SLUGS = ['dimitar-nakov', 'ivan-zdravkov']

const getGuides = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'guides',
      where: { slug: { in: FEATURED_SLUGS } },
      limit: FEATURED_SLUGS.length,
      depth: 1,
    })
    return docs as unknown as Guide[]
  },
  ['contact-guides'],
  { tags: ['guides'], revalidate: 3600 },
)

export async function ContactGuidesBlock({ heading = 'Разгледай нашите гидове' }: { heading?: string }) {
  const guides = await getGuides()
  return <ContactGuidesBlockRenderer heading={heading} guides={guides} />
}
