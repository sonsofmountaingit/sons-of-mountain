import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FooterClient } from './FooterClient'
import { FooterEditButton } from './FooterEditButton'
import { translations } from '@/lib/translations'

const BG_MONTHS = translations.BG.months
const EN_MONTHS = translations.EN.months

const getFooterData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'footer', overrideAccess: true })
    } catch {
      return null
    }
  },
  ['footer-global'],
  { tags: ['footer'], revalidate: false },
)

const getNavigationData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'navigation', overrideAccess: true })
    } catch {
      return null
    }
  },
  ['navigation-global'],
  { tags: ['navigation'], revalidate: false },
)

const getAllActiveTrips = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'trips',
        where: { status: { equals: 'active' } },
        sort: 'startDate',
        limit: 20,
        depth: 1,
        overrideAccess: true,
      })
      return docs
    } catch {
      return []
    }
  },
  ['footer-trips-auto'],
  { tags: ['footer', 'trips'], revalidate: false },
)

const getAllTripsPool = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'trips',
        where: { status: { not_equals: 'draft' } },
        sort: 'startDate',
        limit: 100,
        depth: 1,
        overrideAccess: true,
      })
      return docs
    } catch {
      return []
    }
  },
  ['footer-trips-pool'],
  { tags: ['footer', 'trips'], revalidate: false },
)

const getAllProgramsPool = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'programs',
        where: { status: { not_equals: 'draft' } },
        sort: 'startDate',
        limit: 100,
        depth: 1,
        overrideAccess: true,
      })
      return docs
    } catch {
      return []
    }
  },
  ['footer-programs-pool'],
  { tags: ['footer', 'programs'], revalidate: false },
)

const getAllActivePrograms = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'programs',
        where: { status: { equals: 'active' } },
        sort: 'startDate',
        limit: 20,
        depth: 1,
        overrideAccess: true,
      })
      return docs
    } catch {
      return []
    }
  },
  ['footer-programs-auto'],
  { tags: ['footer', 'programs'], revalidate: false },
)

export async function Footer() {
  const [data, navData] = await Promise.all([getFooterData(), getNavigationData()])
  const source = (data as any)?.travelLinkSource ?? 'auto'
  const selectedTrips: { trip: any; relationTo?: string }[] = (data as any)?.selectedTrips ?? []

  let trips: (any & { __kind: 'trip' | 'program' })[] = []

  if (source === 'manual' && selectedTrips.length > 0) {
    const [tripsPool, programsPool] = await Promise.all([getAllTripsPool(), getAllProgramsPool()])
    trips = selectedTrips
      .map((s) => {
        const isRelObj = s.trip && typeof s.trip === 'object' && 'value' in s.trip
        const id = isRelObj ? s.trip.value : (typeof s.trip === 'object' ? s.trip?.id : s.trip)
        const kind = isRelObj ? s.trip.relationTo : (s.relationTo ?? 'trips')
        const pool = kind === 'programs' ? programsPool : tripsPool
        const doc = pool.find((t: any) => String(t.id) === String(id))
        return doc ? { ...doc, __kind: kind === 'programs' ? 'program' : 'trip' } : null
      })
      .filter(Boolean) as any[]
  } else if (source === 'autoWithPrograms') {
    const [activeTrips, activePrograms] = await Promise.all([getAllActiveTrips(), getAllActivePrograms()])
    trips = [
      ...activeTrips.map((t: any) => ({ ...t, __kind: 'trip' as const })),
      ...activePrograms.map((p: any) => ({ ...p, __kind: 'program' as const })),
    ].sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime())
  } else {
    const activeTrips = await getAllActiveTrips()
    trips = activeTrips.map((t: any) => ({ ...t, __kind: 'trip' as const }))
  }

  const subscribeHeading = (data as any)?.subscribeHeading ?? 'Абонирай се'
  const subscribeSubtext = (data as any)?.subscribeSubtext ?? 'Научавай първи за предстоящи пътешествия, отстъпки и събития.'
  const followHeading = (data as any)?.followHeading ?? 'Последвай ни!'
  const followSubtext = (data as any)?.followSubtext ?? 'Стани част от нашата общност и следи приключенията ни отблизо.'
  const facebookUrl = (data as any)?.facebookUrl ?? 'https://facebook.com/sonsofmountains'
  const instagramUrl = (data as any)?.instagramUrl ?? 'https://instagram.com/sonsofmountains'
  const facebookFollowers = (data as any)?.facebookFollowers ?? '20.2K'
  const instagramFollowers = (data as any)?.instagramFollowers ?? '23.8K'
  const travelSectionHeading = (data as any)?.travelSectionHeading ?? 'ПЪТУВАЙ С НАС'
  const navSectionHeading = (data as any)?.navSectionHeading ?? 'НАВИГАЦИЯ'
  const navLinkSource = (data as any)?.navLinkSource ?? 'auto'
  const manualNavLinks: { label: string; href: string }[] = (data as any)?.navLinks ?? []
  const autoNavLinks: { label: string; href: string }[] = [
    ...((navData as any)?.navLinksLeft ?? []),
    ...((navData as any)?.navLinksRight ?? []),
  ]
  const navLinks = navLinkSource === 'manual' ? manualNavLinks : autoNavLinks

  const travelLinks = trips.map((trip: any) => {
    const date = trip.startDate ? new Date(trip.startDate) : null
    const year = date ? date.getFullYear() : null
    const month = date ? BG_MONTHS[date.getMonth()] : ''
    const monthLabel = year ? `${month} ${year}` : month
    const base = trip.__kind === 'program' ? '/programs' : '/trips'
    const href = trip.slug ? `${base}/${trip.slug}` : `/shop/${trip.id}`
    return {
      name: trip.title,
      month: monthLabel,
      href,
    }
  })
  const copyright = (data as any)?.copyright ?? '© 2018-2026 Сонс оф Моунтаин'
  const licenseText = (data as any)?.licenseText ?? 'Номер на лиценз: РК-01-8245 / 28.07.2022'
  const insuranceText = (data as any)?.insuranceText ?? 'Номер на застрахователна полица: 03700100005995 / 31.08.2025'
  const creditPrefix = (data as any)?.creditPrefix ?? 'Дизайн и разработка от'
  const creditName = (data as any)?.creditName ?? 'Netinsky'
  const creditUrl = (data as any)?.creditUrl ?? 'https://netinsky.com'
  const termsUrl = (data as any)?.termsUrl ?? '/legal/terms'
  const privacyUrl = (data as any)?.privacyUrl ?? '/legal/privacy-policy'
  const logoUrl = typeof (data as any)?.logo === 'object' ? (data as any)?.logo?.url : null
  const logoColoredUrl = typeof (data as any)?.logoColored === 'object' ? (data as any)?.logoColored?.url : null
  const submitLabel = (data as any)?.submitLabel ?? 'Абонирай се'
  const firstNamePlaceholder = (data as any)?.firstNamePlaceholder ?? 'Име'
  const lastNamePlaceholder = (data as any)?.lastNamePlaceholder ?? 'Фамилия'
  const emailPlaceholder = (data as any)?.emailPlaceholder ?? 'E-mail адрес'
  const consentText = (data as any)?.consentText ?? 'С натискането на бутона "Абонирай се" се съгласяваш с'
  const consentLinkText = (data as any)?.consentLinkText ?? 'Политиката ни за поверителност'

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .footer-cols {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
          .footer-desc-col {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 600px) {
          .footer-cols {
            grid-template-columns: 1fr !important;
          }
          .footer-desc-col {
            grid-column: 1 !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .footer-bottom-right {
            align-items: flex-start !important;
          }
        }
      `}</style>
      <footer style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
        <FooterClient
          travelLinks={travelLinks}
          navLinks={navLinks}
          travelSectionHeading={travelSectionHeading}
          navSectionHeading={navSectionHeading}
          followHeading={followHeading}
          followSubtext={followSubtext}
          subscribeHeading={subscribeHeading}
          subscribeSubtext={subscribeSubtext}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
          facebookFollowers={facebookFollowers}
          instagramFollowers={instagramFollowers}
          logoUrl={logoUrl}
          logoColoredUrl={logoColoredUrl}
          copyright={copyright}
          licenseText={licenseText}
          insuranceText={insuranceText}
          creditPrefix={creditPrefix}
          creditName={creditName}
          creditUrl={creditUrl}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          submitLabel={submitLabel}
          firstNamePlaceholder={firstNamePlaceholder}
          lastNamePlaceholder={lastNamePlaceholder}
          emailPlaceholder={emailPlaceholder}
          consentText={consentText}
          consentLinkText={consentLinkText}
        />
      </footer>
      <FooterEditButton />
    </>
  )
}
