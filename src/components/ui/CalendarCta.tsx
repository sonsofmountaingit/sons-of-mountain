import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CalendarCtaBlock } from '@/components/blocks/calendar-cta/CalendarCtaBlock'
import { CalendarCtaEditButton } from './CalendarCtaEditButton'

const getCalendarCtaData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'calendar-cta' })
    } catch {
      return null
    }
  },
  ['calendar-cta-global'],
  { tags: ['calendar-cta'], revalidate: 3600 },
)

export async function CalendarCta() {
  const data = await getCalendarCtaData()
  const d = data as any

  return (
    <>
      <CalendarCtaBlock
        heading={d?.heading ?? 'Търсиш следващото приключение?'}
        subheading={d?.subheading ?? 'Разгледай всички предстоящи пътувания.'}
        buttonText={d?.buttonText ?? 'Виж календара'}
        buttonUrl={d?.buttonUrl ?? '/calendar'}
      />
      <CalendarCtaEditButton />
    </>
  )
}
