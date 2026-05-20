import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TestimonialsBlock } from '@/components/blocks/testimonials/TestimonialsBlock'
import { TestimonialsEditButton } from './TestimonialsEditButton'

const getTestimonialsData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const [section, { docs }] = await Promise.all([
        payload.findGlobal({ slug: 'testimonials-section' }),
        payload.find({ collection: 'testimonials', limit: 100, depth: 1 }),
      ])
      const topRow = docs.filter((d: any) => d.row === 'top')
      const bottomRow = docs.filter((d: any) => d.row === 'bottom')
      return { section, topRow, bottomRow }
    } catch {
      return { section: null, topRow: [], bottomRow: [] }
    }
  },
  ['testimonials-global'],
  { tags: ['testimonials'], revalidate: 3600 },
)

export async function Testimonials() {
  const { section, topRow, bottomRow } = await getTestimonialsData()
  const s = section as any

  return (
    <>
      <TestimonialsBlock
        heading={s?.heading ?? 'Какво казват нашите клиенти'}
        subheading={s?.subheading}
        topRow={topRow as any}
        bottomRow={bottomRow as any}
      />
      <TestimonialsEditButton />
    </>
  )
}
