import { getPayload } from 'payload'
import config from '@payload-config'

// ---------------------------------------------------------------------------
// Image helper
// ---------------------------------------------------------------------------
async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, url: string, slug: string, alt: string): Promise<string | undefined> {
  try {
    const res = await fetch(url)
    const buf = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buf, mimetype: 'image/jpeg', name: `${slug}-hero.jpg`, size: buf.length, type: 'image/jpeg' } as any,
    })
    return doc.id as string
  } catch (e) {
    console.warn(`Image upload failed for ${slug}: ${e}`)
    return undefined
  }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const DESTINATIONS = [
  {
    name: 'Рила Планина',
    slug: 'rila',
    type: 'bulgaria',
    introText: 'Домът на Седемте рилски езера — най-красивият планински масив в България с величествени върхове и кристални води.',
    heroImageUrl: 'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fitnessRatings: { difficulty: 60, comfort: 55, nature: 95, culture: 40 },
    latitude: 42.2, longitude: 23.5,
  },
  {
    name: 'Пирин Планина',
    slug: 'pirin',
    type: 'bulgaria',
    introText: 'Дивата красота на Пирин — мраморни върхове, ледникови езера и смолянисти гори, ЮНЕСКО световно наследство.',
    heroImageUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fitnessRatings: { difficulty: 70, comfort: 50, nature: 92, culture: 35 },
    latitude: 41.8, longitude: 23.5,
  },
  {
    name: 'Родопи',
    slug: 'rhodopes',
    type: 'bulgaria',
    introText: 'Мистичните Родопи — дълбоки ждрела, древни крепости, традиционни села и легендарна гостоприемност.',
    heroImageUrl: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fitnessRatings: { difficulty: 35, comfort: 65, nature: 80, culture: 85 },
    latitude: 41.6, longitude: 24.5,
  },
  {
    name: 'Перу',
    slug: 'peru',
    type: 'abroad',
    introText: 'Мачу Пикчу, Амазония и Андите — едно от най-завладяващите пътувания на света сред инкски руини и непокорена природа.',
    heroImageUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fitnessRatings: { difficulty: 70, comfort: 55, nature: 90, culture: 95 },
    latitude: -13.2, longitude: -72.0,
  },
  {
    name: 'Исландия',
    slug: 'iceland',
    type: 'abroad',
    introText: 'Земята на огъня и леда — гейзери, водопади, северно сияние и вулканичен пейзаж, непостижим никъде другаде.',
    heroImageUrl: 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fitnessRatings: { difficulty: 50, comfort: 70, nature: 98, culture: 65 },
    latitude: 64.9, longitude: -19.0,
  },
  {
    name: 'Мароко',
    slug: 'morocco',
    type: 'abroad',
    introText: 'Сахарските дюни, медините на Маракеш и Фес, атласките планини — Африка в нейното най-вълшебно издание.',
    heroImageUrl: 'https://images.pexels.com/photos/3889834/pexels-photo-3889834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fitnessRatings: { difficulty: 45, comfort: 60, nature: 75, culture: 95 },
    latitude: 31.8, longitude: -7.1,
  },
]

type DestSeed = typeof DESTINATIONS[number]

const TRIPS_DATA = [
  // Bulgaria
  { title: 'Седемте рилски езера', destSlug: 'rila', startDate: '2026-07-10', endDate: '2026-07-14', price: 490, currency: 'BGN', spotsTotal: 14, tags: ['Adventure', 'Family'] },
  { title: 'Черния връх зимен поход', destSlug: 'rila', startDate: '2026-01-15', endDate: '2026-01-18', price: 350, currency: 'BGN', spotsTotal: 10, tags: ['Adventure', 'Singles Only'] },
  { title: 'Вихрен и Синаница', destSlug: 'pirin', startDate: '2026-08-20', endDate: '2026-08-24', price: 550, currency: 'BGN', spotsTotal: 12, tags: ['Adventure'] },
  { title: 'Пирин есенен поход', destSlug: 'pirin', startDate: '2026-10-03', endDate: '2026-10-06', price: 420, currency: 'BGN', spotsTotal: 12, tags: ['Adventure', 'Cultural'] },
  { title: 'Ягодинска пещера и Триград', destSlug: 'rhodopes', startDate: '2026-05-08', endDate: '2026-05-10', price: 280, currency: 'BGN', spotsTotal: 16, tags: ['Cultural', 'Family'] },
  { title: 'Родопска приказка', destSlug: 'rhodopes', startDate: '2026-09-18', endDate: '2026-09-21', price: 390, currency: 'BGN', spotsTotal: 14, tags: ['Cultural'] },
  // Abroad
  { title: 'Мачу Пикчу и Амазония', destSlug: 'peru', startDate: '2026-04-05', endDate: '2026-04-17', price: 2890, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Cultural'] },
  { title: 'Перу – Инките и Андите', destSlug: 'peru', startDate: '2026-11-08', endDate: '2026-11-20', price: 2750, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Cultural'] },
  { title: 'Исландия – Северно сияние', destSlug: 'iceland', startDate: '2026-02-14', endDate: '2026-02-21', price: 1890, currency: 'EUR', spotsTotal: 12, tags: ['Adventure', 'Singles Only'] },
  { title: 'Исландия – Ринг Роуд', destSlug: 'iceland', startDate: '2026-06-20', endDate: '2026-06-30', price: 2290, currency: 'EUR', spotsTotal: 12, tags: ['Adventure', 'Family'] },
  { title: 'Мароко – Сахара и Атлас', destSlug: 'morocco', startDate: '2026-03-12', endDate: '2026-03-20', price: 1490, currency: 'EUR', spotsTotal: 14, tags: ['Adventure', 'Cultural'] },
  { title: 'Мароко – Медини и море', destSlug: 'morocco', startDate: '2026-10-15', endDate: '2026-10-23', price: 1390, currency: 'EUR', spotsTotal: 14, tags: ['Cultural', 'Family'] },
]

const PROGRAMS_DATA = [
  {
    title: 'Йога ретрийт в Родопи',
    slug: 'yoga-rhodopes-2026',
    type: 'Yoga',
    shortDescription: 'Петдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори.',
    location: 'Триград, България',
    startDate: '2026-05-20',
    endDate: '2026-05-25',
    price: 680,
    currency: 'EUR',
    spotsTotal: 14,
    tags: ['Yoga', 'Wellness', 'Singles Only'],
    heroImageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1200',
    instructor: { name: 'Мария Петрова', bio: 'Сертифициран йога инструктор с 12 години опит в хатха и виняса йога.' },
    latitude: 41.63, longitude: 24.3,
  },
  {
    title: 'Ски уикенд в Банско',
    slug: 'ski-bansko-2026',
    type: 'Ski',
    shortDescription: 'Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski.',
    location: 'Банско, България',
    startDate: '2026-01-22',
    endDate: '2026-01-26',
    price: 590,
    currency: 'BGN',
    spotsTotal: 16,
    tags: ['Ski', 'Family', 'Adventure'],
    heroImageUrl: 'https://images.pexels.com/photos/848618/pexels-photo-848618.jpeg?auto=compress&cs=tinysrgb&w=1200',
    instructor: { name: 'Иван Стоянов', bio: 'Ски инструктор ниво 3, 10 години в Банско.' },
    latitude: 41.83, longitude: 23.49,
  },
  {
    title: 'Фотографски уикенд – Пловдив',
    slug: 'photography-plovdiv-2026',
    type: 'Photography',
    shortDescription: 'Уъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки.',
    location: 'Пловдив, България',
    startDate: '2026-04-18',
    endDate: '2026-04-20',
    price: 320,
    currency: 'BGN',
    spotsTotal: 10,
    tags: ['Photography', 'Cultural'],
    heroImageUrl: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1200',
    instructor: { name: 'Георги Василев', bio: 'Пейзажен и документален фотограф, публикуван в National Geographic.' },
    latitude: 42.15, longitude: 24.75,
  },
  {
    title: 'Велнес ретрийт – Черно море',
    slug: 'wellness-black-sea-2026',
    type: 'Wellness',
    shortDescription: 'Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море.',
    location: 'Созопол, България',
    startDate: '2026-09-05',
    endDate: '2026-09-11',
    price: 890,
    currency: 'EUR',
    spotsTotal: 12,
    tags: ['Wellness', 'Couples', 'Singles Only'],
    heroImageUrl: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200',
    instructor: { name: 'Нина Иванова', bio: 'Велнес коуч и специалист по аюрведа.' },
    latitude: 42.42, longitude: 27.7,
  },
  {
    title: 'Ветроходство – Гърция',
    slug: 'sailing-greece-2026',
    type: 'Sailing',
    shortDescription: 'Седем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим.',
    location: 'Левкада, Гърция',
    startDate: '2026-07-04',
    endDate: '2026-07-11',
    price: 1290,
    currency: 'EUR',
    spotsTotal: 10,
    tags: ['Sailing', 'Adventure', 'Couples'],
    heroImageUrl: 'https://images.pexels.com/photos/1533766/pexels-photo-1533766.jpeg?auto=compress&cs=tinysrgb&w=1200',
    instructor: { name: 'Борислав Начев', bio: 'Капитан с лиценз RYA Day Skipper, 15 години ветроходство.' },
    latitude: 38.83, longitude: 20.71,
  },
  {
    title: 'Хайкинг Доломити',
    slug: 'hiking-dolomites-2026',
    type: 'Hiking',
    shortDescription: 'Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка.',
    location: 'Кортина д\'Ампецо, Италия',
    startDate: '2026-08-01',
    endDate: '2026-08-09',
    price: 1490,
    currency: 'EUR',
    spotsTotal: 12,
    tags: ['Adventure', 'Hiking'],
    heroImageUrl: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1200',
    instructor: { name: 'Стефан Иванов', bio: 'Планински водач с 8 години опит в Алпите.' },
    latitude: 46.54, longitude: 12.14,
  },
]

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seed() {
  const payload = await getPayload({ config })

  // 1. Destinations
  console.log('\n--- Destinations ---')
  const destIdBySlug: Record<string, number | string> = {}

  for (const dest of DESTINATIONS as DestSeed[]) {
    const existing = await payload.find({ collection: 'destinations', where: { slug: { equals: dest.slug } }, limit: 1 })

    let mediaId: string | undefined
    if (existing.docs.length === 0) {
      mediaId = await uploadImage(payload, dest.heroImageUrl, dest.slug, dest.name)
    }

    if (existing.docs.length > 0) {
      destIdBySlug[dest.slug] = existing.docs[0].id as number | string
      console.log(`  skip (exists): ${dest.name}`)
      continue
    }

    const created = await payload.create({
      collection: 'destinations',
      data: {
        name: dest.name,
        slug: dest.slug,
        type: dest.type as 'bulgaria' | 'abroad',
        introText: dest.introText,
        ...(mediaId ? { heroImage: mediaId } : {}),
        fitnessRatings: dest.fitnessRatings,
        latitude: dest.latitude,
        longitude: dest.longitude,
      } as any,
    })
    destIdBySlug[dest.slug] = created.id as number | string
    console.log(`  created: ${dest.name}`)
  }

  // 2. Trips
  console.log('\n--- Trips ---')
  for (const trip of TRIPS_DATA) {
    const destId = destIdBySlug[trip.destSlug]
    if (!destId) { console.warn(`  no dest for ${trip.destSlug}, skip`); continue }

    const existing = await payload.find({
      collection: 'trips',
      where: { and: [{ title: { equals: trip.title } }, { destination: { equals: destId } }] },
      limit: 1,
    })
    if (existing.docs.length > 0) { console.log(`  skip (exists): ${trip.title}`); continue }

    await payload.create({
      collection: 'trips',
      data: {
        title: trip.title,
        destination: destId,
        startDate: trip.startDate,
        endDate: trip.endDate,
        price: trip.price,
        currency: trip.currency as 'BGN' | 'EUR' | 'USD',
        spotsTotal: trip.spotsTotal,
        spotsAvailable: trip.spotsTotal,
        status: 'active',
        tags: trip.tags.map((tag) => ({ tag })),
      } as any,
    })
    console.log(`  created: ${trip.title}`)
  }

  // 3. Programs (Индивидуални)
  console.log('\n--- Programs ---')
  for (const prog of PROGRAMS_DATA) {
    const existing = await payload.find({ collection: 'programs', where: { slug: { equals: prog.slug } }, limit: 1 })
    if (existing.docs.length > 0) { console.log(`  skip (exists): ${prog.title}`); continue }

    let mediaId: string | undefined
    mediaId = await uploadImage(payload, prog.heroImageUrl, prog.slug, prog.title)

    await payload.create({
      collection: 'programs',
      data: {
        title: prog.title,
        slug: prog.slug,
        type: prog.type,
        shortDescription: prog.shortDescription,
        location: prog.location,
        startDate: prog.startDate,
        endDate: prog.endDate,
        price: prog.price,
        currency: prog.currency as 'BGN' | 'EUR' | 'USD',
        spotsTotal: prog.spotsTotal,
        spotsAvailable: prog.spotsTotal,
        status: 'active',
        tags: prog.tags.map((tag) => ({ tag })),
        instructor: prog.instructor,
        latitude: prog.latitude,
        longitude: prog.longitude,
        ...(mediaId ? { heroImage: mediaId } : {}),
      } as any,
    })
    console.log(`  created: ${prog.title}`)
  }

  console.log('\nSeed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
