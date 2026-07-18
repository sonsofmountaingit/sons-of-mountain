import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TestimonialsBlock } from '@/components/blocks/testimonials/TestimonialsBlock'
import { TestimonialsEditButton } from './TestimonialsEditButton'
import { translations, type Language } from '@/lib/translations'

interface TestimonialDoc {
  id: string
  authorName: string
  quote: string
  role?: string
  instagramHandle?: string
  rating: number
  row: 'top' | 'bottom'
  avatar?: { url?: string; alt?: string } | null
  cardImage?: { url?: string; alt?: string } | null
}

interface TestimonialSection {
  heading?: string
  subheading?: string
}

const getTestimonialsData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const [section, { docs }] = await Promise.all([
        payload.findGlobal({ slug: 'testimonials-section', overrideAccess: true }),
        payload.find({ collection: 'testimonials', limit: 100, depth: 1, overrideAccess: true }),
      ])
      const allDocs = docs as unknown as TestimonialDoc[]
      const topRow = allDocs.filter((d) => d.row === 'top')
      const bottomRow = allDocs.filter((d) => d.row === 'bottom')
      return { section: section as unknown as TestimonialSection, topRow, bottomRow }
    } catch {
      return { section: null as TestimonialSection | null, topRow: [] as TestimonialDoc[], bottomRow: [] as TestimonialDoc[] }
    }
  },
  ['testimonials-global'],
  { tags: ['testimonials'], revalidate: false },
)

export async function Testimonials() {
  const { section, topRow, bottomRow } = await getTestimonialsData()
  const cookieStore = await cookies()
  const stored = cookieStore.get('language')?.value as Language | undefined
  const language: Language = stored === 'BG' || stored === 'EN' ? stored : 'BG'
  const t = translations[language]

  return (
    <>
      <TestimonialsBlock
        heading={section?.heading ?? t.destination_page.from_our_guests}
        subheading={section?.subheading}
        topRow={topRow}
        bottomRow={bottomRow}
      />
      <TestimonialsEditButton />
    </>
  )
}
