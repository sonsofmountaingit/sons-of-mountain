import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FooterForm } from './FooterForm'
import { ShakingCredit } from './ShakingCredit'
import { FooterEditButton } from './FooterEditButton'
import { FooterLogo } from './FooterLogo'
import { FooterSocialCounter } from './FooterSocialCounter'
import { FooterShakingLink } from './FooterShakingLink'
import { FooterReveal } from './FooterReveal'

const BG_MONTHS = ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември']

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
  { tags: ['footer'], revalidate: 3600 },
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
  { tags: ['navigation'], revalidate: 3600 },
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
  { tags: ['footer', 'trips'], revalidate: 3600 },
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
  { tags: ['footer', 'trips'], revalidate: 3600 },
)

export async function Footer() {
  const [data, navData] = await Promise.all([getFooterData(), getNavigationData()])
  const source = (data as any)?.travelLinkSource ?? 'auto'
  const selectedTrips: { trip: any }[] = (data as any)?.selectedTrips ?? []
  const manualIds = selectedTrips.map((s) => typeof s.trip === 'object' ? s.trip?.id : s.trip).filter(Boolean)
  const allTrips = source === 'manual' && manualIds.length > 0
    ? await getAllTripsPool()
    : await getAllActiveTrips()

  const trips = source === 'manual' && manualIds.length > 0
    ? manualIds.map((id) => allTrips.find((t: any) => String(t.id) === String(id))).filter(Boolean)
    : allTrips

  const subscribeHeading = (data as any)?.subscribeHeading ?? 'Абонирай се'
  const subscribeSubtext = (data as any)?.subscribeSubtext ?? 'Научавай първи за предстоящи пътешествия, отстъпки и събития.'
  const followHeading = (data as any)?.followHeading ?? 'Последвай ни!'
  const followSubtext = (data as any)?.followSubtext ?? 'Стани част от нашата общност и следи приключенията ни отблизо.'
  const facebookUrl = (data as any)?.facebookUrl ?? 'https://facebook.com/panicframe'
  const instagramUrl = (data as any)?.instagramUrl ?? 'https://instagram.com/panicframe'
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
    const dest = trip.destination
    const name = typeof dest === 'object' ? dest?.name : String(dest)
    const slug = typeof dest === 'object' ? dest?.slug : null
    const date = trip.startDate ? new Date(trip.startDate) : null
    const year = date ? date.getFullYear() : null
    const month = date ? BG_MONTHS[date.getMonth()] : ''
    const monthLabel = year && year > 2025 ? `${month} ${year}` : month
    return {
      name: name ?? trip.title,
      month: monthLabel,
      href: slug ? `/destinations/${slug}` : '/destinations',
    }
  })
  const copyright = (data as any)?.copyright ?? '© 2018-2026 Паник Фрейм енд Травел'
  const licenseText = (data as any)?.licenseText ?? 'Номер на лиценз: РК-01-8245 / 28.07.2022'
  const insuranceText = (data as any)?.insuranceText ?? 'Номер на застрахователна полица: 03700100005995 / 31.08.2025'
  const creditPrefix = (data as any)?.creditPrefix ?? 'Дизайн и разработка от'
  const creditName = (data as any)?.creditName ?? 'Netinsky'
  const creditUrl = (data as any)?.creditUrl ?? 'https://netinsky.com'
  const termsUrl = (data as any)?.termsUrl ?? '/legal/terms'
  const termsLabel = (data as any)?.termsLabel ?? 'Общи условия'
  const privacyUrl = (data as any)?.privacyUrl ?? '/legal/cookies'
  const privacyLabel = (data as any)?.privacyLabel ?? 'Политика за поверителност'
  const submitLabel = (data as any)?.submitLabel ?? 'Абонирай се'
  const firstNamePlaceholder = (data as any)?.firstNamePlaceholder ?? 'Име'
  const lastNamePlaceholder = (data as any)?.lastNamePlaceholder ?? 'Фамилия'
  const emailPlaceholder = (data as any)?.emailPlaceholder ?? 'E-mail адрес'
  const consentText = (data as any)?.consentText ?? 'С натискането на бутона "Абонирай се" се съгласяваш с'
  const consentLinkText = (data as any)?.consentLinkText ?? 'Политиката ни за поверителност'

  const seenHrefs = new Set<string>()
  const uniqueTravelLinks = travelLinks.filter((l) => {
    if (seenHrefs.has(l.href)) return false
    seenHrefs.add(l.href)
    return true
  })
  const half = Math.ceil(uniqueTravelLinks.length / 2)
  const travelCol1 = uniqueTravelLinks.slice(0, half)
  const travelCol2 = uniqueTravelLinks.slice(half)

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
        <FooterReveal>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>

          {/* Top columns row */}
          <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.6fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'start' }}>

            {/* Column 1: Travel links */}
            <div data-reveal>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
                {travelSectionHeading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {uniqueTravelLinks.map((link, i) => (
                  <li key={i} data-reveal>
                    <FooterShakingLink href={link.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ffffff' }}>{link.name}</span>
                      {link.month && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{link.month}</span>}
                    </FooterShakingLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Navigation */}
            <div data-reveal>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
                {navSectionHeading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {navLinks.map((link, i) => (
                  <li key={i} data-reveal>
                    <FooterShakingLink href={link.href} style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ffffff', textDecoration: 'none' }}>
                      {link.label}
                    </FooterShakingLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Follow / Social */}
            <div data-reveal>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
                {followHeading}
              </p>
              <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
                {followSubtext}
              </p>
              <FooterSocialCounter
                facebookUrl={facebookUrl}
                facebookFollowers={facebookFollowers}
                instagramUrl={instagramUrl}
                instagramFollowers={instagramFollowers}
              />
            </div>

            {/* Column 4: Subscribe + description */}
            <div className="footer-desc-col" data-reveal>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.25rem 0' }}>
                {subscribeHeading}
              </p>
              <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1.25rem 0', lineHeight: 1.7 }}>
                {subscribeSubtext}
              </p>
              <FooterForm
                privacyUrl={privacyUrl}
                submitLabel={submitLabel}
                firstNamePlaceholder={firstNamePlaceholder}
                lastNamePlaceholder={lastNamePlaceholder}
                emailPlaceholder={emailPlaceholder}
                consentText={consentText}
                consentLinkText={consentLinkText}
              />
            </div>
          </div>

          {/* Big brand text */}
          <div data-reveal style={{ overflow: 'hidden', paddingTop: '2.5rem', userSelect: 'none', width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
            <p style={{
              fontSize: '13vw',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              margin: 0,
              lineHeight: 0.85,
              textTransform: 'uppercase',
              whiteSpace: 'normal',
              textAlign: 'center',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)',
              maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)',
            }}>
              SONS OF<br />MOUNTAIN
            </p>
          </div>

          {/* Bottom bar */}
          <div data-reveal className="footer-bottom" style={{ paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <FooterLogo />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{copyright}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{licenseText}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{insuranceText}</p>
              </div>
            </div>

            <div className="footer-bottom-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <Link href={termsUrl} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                  {termsLabel}
                </Link>
                <Link href={privacyUrl} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                  {privacyLabel}
                </Link>
              </div>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                {creditPrefix}{' '}
                <ShakingCredit name={creditName} href={creditUrl} />
              </p>
            </div>
          </div>
        </div>
        </FooterReveal>
      </footer>
      <FooterEditButton />
    </>
  )
}
