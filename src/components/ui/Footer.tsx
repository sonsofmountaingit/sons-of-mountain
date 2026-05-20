import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FooterForm } from './FooterForm'
import { ShakingCredit } from './ShakingCredit'
import { FooterEditButton } from './FooterEditButton'
import { FooterLogo } from './FooterLogo'

const BG_MONTHS = ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември']

const getFooterData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'footer' })
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
      return await payload.findGlobal({ slug: 'navigation' })
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
        @media (max-width: 767px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .footer-bottom-bar {
            grid-template-columns: 1fr !important;
            justify-items: center;
            text-align: center;
            gap: 1.25rem !important;
          }
          .footer-bottom-left {
            align-items: center !important;
          }
          .footer-bottom-right {
            align-items: center !important;
          }
          .footer-travel-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-nav-link {
            font-size: 0.8rem !important;
          }
          .footer-travel-link-name {
            font-size: 0.8rem !important;
          }
          .footer-travel-link-month {
            font-size: 0.7rem !important;
          }
        }
      `}</style>
      <footer style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="footer-main-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr 220px', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'start' }}>

            {/* Left: Subscribe + Follow cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                  {subscribeHeading}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>
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

              <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                  {followHeading}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>
                  {followSubtext}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="34" height="34" rx="8" fill="#1877F2"/>
                      <path d="M23 17c0-3.314-2.686-6-6-6s-6 2.686-6 6c0 2.995 2.193 5.477 5.063 5.927V18.89h-1.524V17h1.524v-1.323c0-1.504.896-2.334 2.265-2.334.656 0 1.342.117 1.342.117v1.476h-.756c-.744 0-.976.462-.976.936V17h1.66l-.265 1.89h-1.395v4.037C20.807 22.477 23 19.995 23 17z" fill="white"/>
                    </svg>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{facebookFollowers}</span>
                  </a>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="ig-footer" cx="30%" cy="107%" r="120%">
                          <stop offset="0%" stopColor="#ffd600"/>
                          <stop offset="30%" stopColor="#ff6930"/>
                          <stop offset="60%" stopColor="#fe3b93"/>
                          <stop offset="100%" stopColor="#9e34d4"/>
                        </radialGradient>
                      </defs>
                      <rect width="34" height="34" rx="8" fill="url(#ig-footer)"/>
                      <rect x="9" y="9" width="16" height="16" rx="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
                      <circle cx="17" cy="17" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
                      <circle cx="22" cy="12" r="1" fill="white"/>
                    </svg>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{instagramFollowers}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Middle: Travel links in 2 sub-columns */}
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>
                {travelSectionHeading}
              </p>
              <div className="footer-travel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {travelCol1.map((link, i) => (
                    <li key={`col1-${i}`}>
                      <Link href={link.href} style={{ textDecoration: 'none' }}>
                        <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{link.name}</span>
                        {link.month && <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{link.month}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {travelCol2.map((link, i) => (
                    <li key={`col2-${i}`}>
                      <Link href={link.href} style={{ textDecoration: 'none' }}>
                        <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{link.name}</span>
                        {link.month && <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{link.month}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Navigation */}
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>
                {navSectionHeading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {navLinks.map((link, i) => (
                  <li key={`nav-${i}`}>
                    <Link href={link.href} className="footer-nav-link" style={{ fontSize: '1rem', color: '#ffffff', textDecoration: 'none' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom-bar" style={{ paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}>
            <div className="footer-bottom-left" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{copyright}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{licenseText}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{insuranceText}</p>
            </div>

            <FooterLogo />

            <div className="footer-bottom-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link href={termsUrl} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                  {termsLabel}
                </Link>
                <Link href={privacyUrl} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                  {privacyLabel}
                </Link>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                {creditPrefix}{' '}
                <ShakingCredit name={creditName} href={creditUrl} />
              </p>
            </div>
          </div>
        </div>
      </footer>
      <FooterEditButton />
    </>
  )
}
