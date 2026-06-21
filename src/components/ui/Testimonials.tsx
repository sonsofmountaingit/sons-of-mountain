import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TestimonialsBlock } from '@/components/blocks/testimonials/TestimonialsBlock'
import { TestimonialsEditButton } from './TestimonialsEditButton'

interface TestimonialDoc {
  id: string
  authorName: string
  quote: string
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

  return (
    <>
      <TestimonialsBlock
        heading={section?.heading ?? 'Какво казват нашите клиенти'}
        subheading={section?.subheading}
        topRow={topRow}
        bottomRow={bottomRow}
      />
      <TestimonialsEditButton />
    </>
  )
}
