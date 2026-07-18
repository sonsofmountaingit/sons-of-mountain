import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CalendarCtaBlock } from '@/components/blocks/calendar-cta/CalendarCtaBlock'
import { CalendarCtaEditButton } from './CalendarCtaEditButton'
import { mediaUrl } from '@/lib/media-url'
import { translations, type Language } from '@/lib/translations'

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
  { tags: ['calendar-cta'], revalidate: false },
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
  { tags: ['calendar-cta', 'destinations'], revalidate: false },
)

export async function CalendarCta() {
  const [data, destinationImages] = await Promise.all([
    getCalendarCtaData(),
    getDestinationImages(),
  ])
  const d = data as any
  const cookieStore = await cookies()
  const stored = cookieStore.get('language')?.value as Language | undefined
  const language: Language = stored === 'BG' || stored === 'EN' ? stored : 'BG'
  const t = translations[language]

  return (
    <>
      <CalendarCtaBlock
        heading={d?.heading ?? t.calendar_cta.heading}
        subheading={d?.subheading ?? t.calendar_cta.subheading}
        buttonText={d?.buttonText ?? t.calendar_cta.button}
        buttonUrl={d?.buttonUrl ?? '/calendar'}
        destinationImages={destinationImages}
      />
      <CalendarCtaEditButton />
    </>
  )
}
