import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CalendarCtaBlock } from '@/components/blocks/calendar-cta/CalendarCtaBlock'
import { CalendarCtaEditButton } from './CalendarCtaEditButton'
import { mediaUrl } from '@/lib/media-url'

const getCalendarCtaData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'calendar-cta', overrideAccess: true })
    } catch {
      return null
    }
  },
  ['calendar-cta-global'],
  { tags: ['calendar-cta'], revalidate: 3600 },
)

const getDestinationImages = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: 'destinations',
        limit: 5,
        overrideAccess: true,
        depth: 1,
      })
      return result.docs
        .map((d: any) => {
          const url = d?.heroImage?.url ?? d?.image?.url ?? null
          return mediaUrl(url)
        })
        .filter(Boolean) as string[]
    } catch {
      return []
    }
  },
  ['calendar-cta-destination-images'],
  { tags: ['calendar-cta', 'destinations'], revalidate: 3600 },
)

export async function CalendarCta() {
  const [data, destinationImages] = await Promise.all([
    getCalendarCtaData(),
    getDestinationImages(),
  ])
  const d = data as any

  return (
    <>
      <CalendarCtaBlock
        heading={d?.heading ?? 'Търсиш следващото приключение?'}
        subheading={d?.subheading ?? 'Разгледай всички предстоящи пътувания.'}
        buttonText={d?.buttonText ?? 'Виж календара'}
        buttonUrl={d?.buttonUrl ?? '/calendar'}
        destinationImages={destinationImages}
      />
      <CalendarCtaEditButton />
    </>
  )
}
