import { getPayload } from 'payload'
import config from '@payload-config'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  alt: string,
  filename: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/jpeg,image/*' } })
    const buf = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buf, mimetype: 'image/jpeg', name: filename, size: buf.length, type: 'image/jpeg' } as any,
      overrideAccess: true,
    })
    return doc.id as string
  } catch (e) {
    console.warn(`  image upload failed (${filename}): ${e}`)
    return undefined
  }
}

function rt(text: string) {
  return {
    root: {
      type: 'root',
      children: [{ type: 'paragraph', children: [{ type: 'text', text, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }],
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  }
}

function rtMulti(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(text => ({ type: 'paragraph', children: [{ type: 'text', text, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 })),
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// 1. Blog Categories
// ---------------------------------------------------------------------------
async function seedBlogCategories(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[1] Blog Categories')
  const cats = [
    { name: 'Дестинации', slug: 'destinations' },
    { name: 'Съвети за пътуване', slug: 'travel-tips' },
    { name: 'Истории от пътя', slug: 'travel-stories' },
    { name: 'Природа и дивата природа', slug: 'nature-wildlife' },
  ]
  const ids: Record<string, string> = {}
  for (const c of cats) {
    const ex = await payload.find({ collection: 'blog-categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (ex.docs.length > 0) { ids[c.slug] = ex.docs[0].id as string; console.log(`  skip: ${c.name}`); continue }
    const doc = await payload.create({ collection: 'blog-categories', data: c, overrideAccess: true })
    ids[c.slug] = doc.id as string
    console.log(`  created: ${c.name}`)
  }
  return ids
}

// ---------------------------------------------------------------------------
// 2. Users
// ---------------------------------------------------------------------------
async function seedUsers(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[2] Users')
  const AVATAR_URLS = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  ]
  const avatarIds: string[] = []
  for (let i = 0; i < AVATAR_URLS.length; i++) {
    const id = await uploadImage(payload, AVATAR_URLS[i], `Avatar ${i + 1}`, `avatar-${i + 1}.jpg`)
    if (id) avatarIds.push(id)
  }

  const users = [
    { name: 'Администратор', email: 'admin@sonsofmountains.bg', username: 'admin', password: 'Admin@SonsOfMountains2026', role: 'admin' },
    { name: 'Димитър Карниколов', email: 'dimitar.karanikolov@seed.test', username: 'dimitar-karanikolov', password: 'seed-password', role: 'editor', instagramHandle: '@d.karanikolov', bio: 'Пътуващ фотограф. Намибия, Етиопия, Централна Азия.' },
    { name: 'Румяна Бозева', email: 'rumyana.boseva@seed.test', username: 'rumyana-boseva', password: 'seed-password', role: 'editor', instagramHandle: '@rumyana_boseva', bio: 'Фотограф и пътешественик. Пейзажна и портретна фотография.' },
  ]

  const ids: string[] = []
  for (let i = 0; i < users.length; i++) {
    const u = users[i]
    const ex = await payload.find({ collection: 'users', where: { email: { equals: u.email } }, limit: 1 })
    if (ex.docs.length > 0) { ids.push(ex.docs[0].id as string); console.log(`  skip: ${u.name}`); continue }
    const doc = await payload.create({
      collection: 'users',
      data: { ...u, ...(avatarIds[i] ? { profileImage: avatarIds[i] } : {}) } as any,
      overrideAccess: true,
    })
    ids.push(doc.id as string)
    console.log(`  created: ${u.name}`)
  }
  return ids
}

// ---------------------------------------------------------------------------
// 3. Destinations (20)
// ---------------------------------------------------------------------------
const DEST_DATA = [
  // Bulgaria
  { name: 'Рила Планина', slug: 'rila', type: 'bulgaria', introText: 'Домът на Седемте рилски езера — най-красивият планински масив в България.', heroImageUrl: 'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 60, comfort: 55, nature: 95, culture: 40 }, latitude: 42.2, longitude: 23.5, continent: 'Europe' },
  { name: 'Пирин Планина', slug: 'pirin', type: 'bulgaria', introText: 'Дивата красота на Пирин — мраморни върхове, ледникови езера, ЮНЕСКО наследство.', heroImageUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 70, comfort: 50, nature: 92, culture: 35 }, latitude: 41.8, longitude: 23.5, continent: 'Europe' },
  { name: 'Родопи', slug: 'rhodopes', type: 'bulgaria', introText: 'Мистичните Родопи — дълбоки ждрела, древни крепости, традиционни села.', heroImageUrl: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 35, comfort: 65, nature: 80, culture: 85 }, latitude: 41.6, longitude: 24.5, continent: 'Europe' },
  { name: 'Стара Планина', slug: 'balkan-mountains', type: 'bulgaria', introText: 'Гръбнакът на България — вековни гори, водопади и Еко пътека Ком-Емине.', heroImageUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 55, comfort: 50, nature: 88, culture: 60 }, latitude: 42.7, longitude: 25.3, continent: 'Europe' },
  { name: 'Витоша', slug: 'vitosha', type: 'bulgaria', introText: 'Белодробният парк на София — достъпен и красив целогодишно.', heroImageUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 30, comfort: 70, nature: 75, culture: 45 }, latitude: 42.56, longitude: 23.29, continent: 'Europe' },
  { name: 'Странджа', slug: 'strandzha', type: 'bulgaria', introText: 'Вековните дъбови гори и Черноморието — биосферен резерват с уникална флора.', heroImageUrl: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 30, comfort: 60, nature: 85, culture: 70 }, latitude: 41.9, longitude: 27.5, continent: 'Europe' },
  { name: 'Черно Море', slug: 'black-sea', type: 'bulgaria', introText: 'Несебър, Созопол, Каварна — историческото крайбрежие на България.', heroImageUrl: 'https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 15, comfort: 85, nature: 70, culture: 80 }, latitude: 42.7, longitude: 27.7, continent: 'Europe' },
  { name: 'Велико Търново', slug: 'veliko-tarnovo', type: 'bulgaria', introText: 'Средновековната столица — Царевец, Арбанаси, Преображенски манастир.', heroImageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 20, comfort: 75, nature: 55, culture: 95 }, latitude: 43.08, longitude: 25.65, continent: 'Europe' },
  // Abroad
  { name: 'Перу', slug: 'peru', type: 'abroad', introText: 'Мачу Пикчу, Амазония и Андите — едно от най-завладяващите пътувания на света.', heroImageUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 70, comfort: 55, nature: 90, culture: 95 }, latitude: -13.2, longitude: -72.0, continent: 'South America' },
  { name: 'Исландия', slug: 'iceland', type: 'abroad', introText: 'Земята на огъня и леда — гейзери, водопади, северно сияние.', heroImageUrl: 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 50, comfort: 70, nature: 98, culture: 65 }, latitude: 64.9, longitude: -19.0, continent: 'Europe' },
  { name: 'Мароко', slug: 'morocco', type: 'abroad', introText: 'Сахарските дюни, медините на Маракеш и Фес, атласките планини.', heroImageUrl: 'https://images.pexels.com/photos/3889834/pexels-photo-3889834.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 45, comfort: 60, nature: 75, culture: 95 }, latitude: 31.8, longitude: -7.1, continent: 'Africa' },
  { name: 'Азорски Острови', slug: 'azores', type: 'abroad', introText: 'Вулканични острови в средата на Атлантическия океан, покрити с изумруденозелена природа.', heroImageUrl: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 40, comfort: 70, nature: 95, culture: 60 }, latitude: 37.7, longitude: -25.5, continent: 'Europe' },
  { name: 'Уганда', slug: 'uganda', type: 'abroad', introText: 'Домът на планинските горили — едно от най-вълнуващите wildlife преживявания на планетата.', heroImageUrl: 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 65, comfort: 50, nature: 98, culture: 70 }, latitude: 1.37, longitude: 32.29, continent: 'Africa' },
  { name: 'Бразилия', slug: 'brazil', type: 'abroad', introText: 'От Амазония до белите пясъци на Ленсойс Мараньенсис — страна на контрасти.', heroImageUrl: 'https://images.pexels.com/photos/2868242/pexels-photo-2868242.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 50, comfort: 60, nature: 90, culture: 85 }, latitude: -14.2, longitude: -51.9, continent: 'South America' },
  { name: 'Непал', slug: 'nepal', type: 'abroad', introText: 'Еверест, Аnapurna Circuit, Покхара — хималайски трекинг от световна класа.', heroImageUrl: 'https://images.pexels.com/photos/2104742/pexels-photo-2104742.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 80, comfort: 40, nature: 99, culture: 90 }, latitude: 28.17, longitude: 84.12, continent: 'Asia' },
  { name: 'Грузия', slug: 'georgia', type: 'abroad', introText: 'Кавказките планини, древни крепости, невероятна кухня и топло гостоприемство.', heroImageUrl: 'https://images.pexels.com/photos/3214958/pexels-photo-3214958.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 45, comfort: 65, nature: 85, culture: 90 }, latitude: 42.3, longitude: 43.4, continent: 'Asia' },
  { name: 'Виетнам', slug: 'vietnam', type: 'abroad', introText: 'Халонг Бей, Хой Ан, планините на Сапа — 3000 км от север до юг.', heroImageUrl: 'https://images.pexels.com/photos/1482193/pexels-photo-1482193.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 35, comfort: 65, nature: 85, culture: 92 }, latitude: 16.1, longitude: 107.8, continent: 'Asia' },
  { name: 'Патагония', slug: 'patagonia', type: 'abroad', introText: 'Торес дел Пайне, ледниците на Аржентина — краят на земята в цялата му дивота.', heroImageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 75, comfort: 45, nature: 99, culture: 40 }, latitude: -51.6, longitude: -72.9, continent: 'South America' },
  { name: 'Мадагаскар', slug: 'madagascar', type: 'abroad', introText: 'Лемури, баобаби и фантастични пейзажи — островът на четвъртия свят.', heroImageUrl: 'https://images.pexels.com/photos/4577793/pexels-photo-4577793.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 55, comfort: 40, nature: 97, culture: 75 }, latitude: -20.0, longitude: 47.0, continent: 'Africa' },
  { name: 'Танзания', slug: 'tanzania', type: 'abroad', introText: 'Килиманджаро, Серенгети, Занзибар — африканската велика тройка на едно място.', heroImageUrl: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1200', fitnessRatings: { difficulty: 60, comfort: 55, nature: 98, culture: 80 }, latitude: -6.37, longitude: 34.89, continent: 'Africa' },
]

async function seedDestinations(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[3] Destinations')
  const ids: Record<string, string> = {}
  for (const d of DEST_DATA) {
    const ex = await payload.find({ collection: 'destinations', where: { slug: { equals: d.slug } }, limit: 1 })
    if (ex.docs.length > 0) { ids[d.slug] = ex.docs[0].id as string; console.log(`  skip: ${d.name}`); continue }
    const heroImage = await uploadImage(payload, d.heroImageUrl, d.name, `${d.slug}-hero.jpg`)
    const doc = await payload.create({
      collection: 'destinations',
      data: {
        name: d.name, slug: d.slug, type: d.type as any,
        introText: d.introText,
        ...(heroImage ? { heroImage } : {}),
        fitnessRatings: d.fitnessRatings,
        latitude: d.latitude, longitude: d.longitude,
        continent: d.continent,
        description: rtMulti([d.introText, 'Открийте красотата на тази дестинация с нашите водачи.']),
        faq: [
          { question: 'Какво ниво на физическа подготовка е необходимо?', answer: 'Средно ниво — подходящо за активни хора без специален опит.' },
          { question: 'Какво е включено в цената?', answer: 'Транспорт, настаняване, водач и всички посочени дейности.' },
        ],
        included: [{ item: 'Транспорт от/до дестинацията' }, { item: 'Настаняване' }, { item: 'Водач' }],
        notIncluded: [{ item: 'Лични разходи' }, { item: 'Застраховка' }],
      } as any,
      overrideAccess: true,
    })
    ids[d.slug] = doc.id as string
    console.log(`  created: ${d.name}`)
  }
  return ids
}

// ---------------------------------------------------------------------------
// 4. Guides (20)
// ---------------------------------------------------------------------------
const GUIDE_DATA = [
  { name: 'Иван Стоянов', slug: 'ivan-stoyanov', bio: 'Планински водач с 15 години опит в Рила и Пирин. Алпинист и любител на природата.', instagram: '@ivan_stoyanov_guide', specializations: ['Hiking', 'Adventure'], yearsExperience: 15, photoUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Мария Петрова', slug: 'maria-petrova', bio: 'Сертифициран йога инструктор с 12 години опит в хатха и виняса йога.', instagram: '@maria_yoga_bg', specializations: ['Yoga', 'Wellness'], yearsExperience: 12, photoUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Георги Василев', slug: 'georgi-vasilev', bio: 'Пейзажен и документален фотограф, публикуван в National Geographic.', instagram: '@gvasilev_photo', specializations: ['Photography'], yearsExperience: 10, photoUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Борислав Начев', slug: 'borislav-nachev', bio: 'Капитан с лиценз RYA Day Skipper, 15 години ветроходство в Средиземно море.', instagram: '@borislav_sailing', specializations: ['Sailing'], yearsExperience: 15, photoUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Нина Иванова', slug: 'nina-ivanova', bio: 'Велнес коуч и специалист по аюрведа с практика в Индия и България.', instagram: '@nina_wellness_bg', specializations: ['Wellness', 'Yoga'], yearsExperience: 8, photoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Стефан Иванов', slug: 'stefan-ivanov', bio: 'Планински водач с 8 години опит в Алпите и Пиренеите.', instagram: '@stefan_alps_guide', specializations: ['Hiking', 'Skiing'], yearsExperience: 8, photoUrl: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Анна Колева', slug: 'anna-koleva', bio: 'Инструктор по сърф с 7 години опит на атлантическото крайбрежие.', instagram: '@anna_surf_guide', specializations: ['Adventure', 'Wellness'], yearsExperience: 7, photoUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Петър Димитров', slug: 'petar-dimitrov', bio: 'Велосипеден инструктор и треккинг водач с опит в Централна Азия.', instagram: '@petar_cycle_bg', specializations: ['Adventure', 'Hiking'], yearsExperience: 9, photoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Силвия Тодорова', slug: 'silvia-todorova', bio: 'Медитационен учител и водач на ретрийти в планините.', instagram: '@silvia_meditation', specializations: ['Wellness', 'Yoga'], yearsExperience: 11, photoUrl: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Николай Попов', slug: 'nikolai-popov', bio: 'Алпинист и скален катерач — ЕК3 водач, UIAA инструктор.', instagram: '@niko_climbing_bg', specializations: ['Adventure', 'Hiking'], yearsExperience: 14, photoUrl: 'https://images.pexels.com/photos/1546912/pexels-photo-1546912.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Виктория Ангелова', slug: 'viktoria-angelova', bio: 'Фотограф и travel blogger с 200+ дни в годината извън България.', instagram: '@viktoria_travels', specializations: ['Photography'], yearsExperience: 6, photoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Тодор Маринов', slug: 'todor-marinov', bio: 'Ски инструктор ниво 3, 12 години в Банско и Бохиньско Бела.', instagram: '@todor_ski_bg', specializations: ['Skiing'], yearsExperience: 12, photoUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Елена Николова', slug: 'elena-nikolova', bio: 'Водач на групи в Африка и Латинска Америка — 10 години по света.', instagram: '@elena_world_guide', specializations: ['Hiking', 'Cultural'], yearsExperience: 10, photoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Христо Георгиев', slug: 'hristo-georgiev', bio: 'Природозащитник и водач на wildlife safari в Уганда и Танзания.', instagram: '@hristo_safari', specializations: ['Adventure', 'Hiking'], yearsExperience: 7, photoUrl: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Десислава Крумова', slug: 'desislava-krumova', bio: 'Yoga и mindfulness инструктор, специализирана в nature retreats.', instagram: '@desi_yoga_nature', specializations: ['Yoga', 'Wellness'], yearsExperience: 9, photoUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Александър Василев', slug: 'alexander-vasilev', bio: 'Хималайски треккинг водач — Annapurna, Everest Base Camp, Langtang.', instagram: '@alex_himalaya', specializations: ['Hiking', 'Adventure'], yearsExperience: 13, photoUrl: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Мила Събева', slug: 'mila-sabeva', bio: 'Инструктор по каяк и rafting — реките на Черна Гора и Грузия.', instagram: '@mila_kayak_bg', specializations: ['Adventure', 'Adventure'], yearsExperience: 8, photoUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Боян Тенев', slug: 'boyan-tenev', bio: 'Бърд уотчинг и екотуризъм водач — Странджа, Дунавска равнина, Добруджа.', instagram: '@boyan_birdwatcher', specializations: ['Adventure', 'Ecology'], yearsExperience: 11, photoUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Таня Иванова', slug: 'tanya-ivanova', bio: 'Астрофотограф и нощен водач — Родопи, Странджа, Западна Пустиня.', instagram: '@tanya_stars', specializations: ['Photography', 'Astronomy'], yearsExperience: 5, photoUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Кристиан Петров', slug: 'kristian-petrov', bio: 'Скален катерач и via ferrata водач — Врачанския Балкан и Доломити.', instagram: '@kristian_rock', specializations: ['Adventure', 'Via Ferrata'], yearsExperience: 6, photoUrl: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=400' },
]

async function seedGuides(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[4] Guides')
  const ids: string[] = []
  for (const g of GUIDE_DATA) {
    const ex = await payload.find({ collection: 'guides', where: { slug: { equals: g.slug } }, limit: 1 })
    if (ex.docs.length > 0) { ids.push(ex.docs[0].id as string); console.log(`  skip: ${g.name}`); continue }
    const photo = await uploadImage(payload, g.photoUrl, g.name, `guide-${g.slug}.jpg`)
    const doc = await payload.create({
      collection: 'guides',
      data: {
        name: g.name, slug: g.slug, bio: g.bio,
        instagram: g.instagram,
        specializations: g.specializations.map(s => ({ specialization: s })),
        yearsExperience: g.yearsExperience,
        ...(photo ? { photo } : {}),
      } as any,
      overrideAccess: true,
    })
    ids.push(doc.id as string)
    console.log(`  created: ${g.name}`)
  }
  return ids
}

// ---------------------------------------------------------------------------
// 5. Trips (20)
// ---------------------------------------------------------------------------
const TRIP_DATA = [
  { title: 'Седемте рилски езера', destSlug: 'rila', startDate: '2026-07-10', endDate: '2026-07-14', price: 490, currency: 'BGN', spotsTotal: 14, tags: ['Adventure', 'Family'], depositAmount: 100 },
  { title: 'Черния връх зимен поход', destSlug: 'rila', startDate: '2027-01-15', endDate: '2027-01-18', price: 350, currency: 'BGN', spotsTotal: 10, tags: ['Adventure', 'Singles Only'], depositAmount: 80 },
  { title: 'Вихрен и Синаница', destSlug: 'pirin', startDate: '2026-08-20', endDate: '2026-08-24', price: 550, currency: 'BGN', spotsTotal: 12, tags: ['Adventure'], depositAmount: 120 },
  { title: 'Пирин есенен поход', destSlug: 'pirin', startDate: '2026-10-03', endDate: '2026-10-06', price: 420, currency: 'BGN', spotsTotal: 12, tags: ['Adventure', 'Cultural'], depositAmount: 100 },
  { title: 'Ягодинска пещера и Триград', destSlug: 'rhodopes', startDate: '2026-05-08', endDate: '2026-05-10', price: 280, currency: 'BGN', spotsTotal: 16, tags: ['Cultural', 'Family'], depositAmount: 70 },
  { title: 'Родопска приказка', destSlug: 'rhodopes', startDate: '2026-09-18', endDate: '2026-09-21', price: 390, currency: 'BGN', spotsTotal: 14, tags: ['Cultural'], depositAmount: 90 },
  { title: 'Ком–Емине: 700 км пеш', destSlug: 'balkan-mountains', startDate: '2026-06-01', endDate: '2026-06-15', price: 1290, currency: 'BGN', spotsTotal: 10, tags: ['Adventure', 'Adventure'], depositAmount: 250 },
  { title: 'Витоша с деца', destSlug: 'vitosha', startDate: '2026-07-04', endDate: '2026-07-05', price: 120, currency: 'BGN', spotsTotal: 20, tags: ['Family'], depositAmount: 30 },
  { title: 'Мачу Пикчу и Амазония', destSlug: 'peru', startDate: '2026-04-05', endDate: '2026-04-17', price: 2890, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Cultural'], depositAmount: 500 },
  { title: 'Перу – Инките и Андите', destSlug: 'peru', startDate: '2026-11-08', endDate: '2026-11-20', price: 2750, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Cultural'], depositAmount: 500 },
  { title: 'Исландия – Северно сияние', destSlug: 'iceland', startDate: '2027-02-14', endDate: '2027-02-21', price: 1890, currency: 'EUR', spotsTotal: 12, tags: ['Adventure', 'Singles Only'], depositAmount: 350 },
  { title: 'Исландия – Ринг Роуд', destSlug: 'iceland', startDate: '2026-06-20', endDate: '2026-06-30', price: 2290, currency: 'EUR', spotsTotal: 12, tags: ['Adventure', 'Family'], depositAmount: 400 },
  { title: 'Мароко – Сахара и Атлас', destSlug: 'morocco', startDate: '2026-03-12', endDate: '2026-03-20', price: 1490, currency: 'EUR', spotsTotal: 14, tags: ['Adventure', 'Cultural'], depositAmount: 280 },
  { title: 'Мароко – Медини и море', destSlug: 'morocco', startDate: '2026-10-15', endDate: '2026-10-23', price: 1390, currency: 'EUR', spotsTotal: 14, tags: ['Cultural', 'Family'], depositAmount: 260 },
  { title: 'Непал – Annapurna Circuit', destSlug: 'nepal', startDate: '2026-10-01', endDate: '2026-10-18', price: 2490, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Adventure'], depositAmount: 450 },
  { title: 'Непал – Everest Base Camp', destSlug: 'nepal', startDate: '2026-03-25', endDate: '2026-04-10', price: 2890, currency: 'EUR', spotsTotal: 8, tags: ['Adventure', 'Adventure'], depositAmount: 500 },
  { title: 'Грузия – Кавказки приключения', destSlug: 'georgia', startDate: '2026-08-05', endDate: '2026-08-14', price: 1290, currency: 'EUR', spotsTotal: 14, tags: ['Adventure', 'Cultural'], depositAmount: 250 },
  { title: 'Виетнам от север до юг', destSlug: 'vietnam', startDate: '2026-12-01', endDate: '2026-12-15', price: 1890, currency: 'EUR', spotsTotal: 12, tags: ['Cultural', 'Family'], depositAmount: 350 },
  { title: 'Патагония – Торес дел Пайне', destSlug: 'patagonia', startDate: '2026-01-10', endDate: '2026-01-22', price: 3490, currency: 'EUR', spotsTotal: 8, tags: ['Adventure', 'Adventure'], depositAmount: 600 },
  { title: 'Танзания – Килиманджаро', destSlug: 'tanzania', startDate: '2026-07-20', endDate: '2026-08-01', price: 2990, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Adventure'], depositAmount: 550 },
]

async function seedTrips(payload: Awaited<ReturnType<typeof getPayload>>, destIds: Record<string, string>, guideIds: string[]) {
  console.log('\n[5] Trips')
  for (const t of TRIP_DATA) {
    const destId = destIds[t.destSlug]
    if (!destId) { console.warn(`  no dest for ${t.destSlug}`); continue }
    const ex = await payload.find({ collection: 'trips', where: { title: { equals: t.title } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${t.title}`); continue }
    await payload.create({
      collection: 'trips',
      data: {
        title: t.title,
        destination: destId,
        startDate: t.startDate,
        endDate: t.endDate,
        price: t.price,
        currency: t.currency as any,
        spotsTotal: t.spotsTotal,
        spotsAvailable: t.spotsTotal,
        status: 'active',
        tags: t.tags.map(tag => ({ tag })),
        depositAmount: t.depositAmount,
        maxParticipantsPerRegistration: 4,
        guides: guideIds.slice(0, 2),
        itinerary: [
          { day: 1, title: 'Пристигане и ориентация', stats: { distance: '5', elevationGain: '100', duration: '2 часа' } },
          { day: 2, title: 'Основен ден', stats: { distance: '15', elevationGain: '600', duration: '7 часа' } },
        ],
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${t.title}`)
  }
}

// ---------------------------------------------------------------------------
// 6. Programs (20)
// ---------------------------------------------------------------------------
const PROG_DATA = [
  { title: 'Йога ретрийт в Родопи', slug: 'yoga-rhodopes-2026', type: 'Yoga', shortDescription: 'Петдневен йога ретрийт сред родопската природа.', location: 'Триград, България', startDate: '2026-05-20', endDate: '2026-05-25', price: 680, currency: 'EUR', spotsTotal: 14, tags: ['Yoga', 'Wellness'], heroImageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Мария Петрова', bio: 'Сертифициран йога инструктор с 12 години опит.' }, latitude: 41.63, longitude: 24.3, durationDays: 5 },
  { title: 'Ски уикенд в Банско', slug: 'ski-bansko-2026', type: 'Ski', shortDescription: 'Четири дни ски и сноуборд в Банско.', location: 'Банско, България', startDate: '2027-01-22', endDate: '2027-01-26', price: 590, currency: 'BGN', spotsTotal: 16, tags: ['Ski', 'Family'], heroImageUrl: 'https://images.pexels.com/photos/848618/pexels-photo-848618.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Тодор Маринов', bio: 'Ски инструктор ниво 3.' }, latitude: 41.83, longitude: 23.49, durationDays: 4 },
  { title: 'Фотографски уъркшоп – Пловдив', slug: 'photography-plovdiv-2026', type: 'Photography', shortDescription: 'Уъркшоп по пейзажна и улична фотография в Пловдив.', location: 'Пловдив, България', startDate: '2026-04-18', endDate: '2026-04-20', price: 320, currency: 'BGN', spotsTotal: 10, tags: ['Photography', 'Cultural'], heroImageUrl: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Георги Василев', bio: 'Пейзажен фотограф, публикуван в National Geographic.' }, latitude: 42.15, longitude: 24.75, durationDays: 2 },
  { title: 'Велнес ретрийт – Черно море', slug: 'wellness-black-sea-2026', type: 'Wellness', shortDescription: 'Шест дни детокс и медитация на Черно море.', location: 'Созопол, България', startDate: '2026-09-05', endDate: '2026-09-11', price: 890, currency: 'EUR', spotsTotal: 12, tags: ['Wellness', 'Wellness'], heroImageUrl: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Нина Иванова', bio: 'Велнес коуч и аюрведа специалист.' }, latitude: 42.42, longitude: 27.7, durationDays: 6 },
  { title: 'Ветроходство – Гърция', slug: 'sailing-greece-2026', type: 'Sailing', shortDescription: 'Седем дни на яхта сред Йонийските острови.', location: 'Левкада, Гърция', startDate: '2026-07-04', endDate: '2026-07-11', price: 1290, currency: 'EUR', spotsTotal: 10, tags: ['Sailing', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1533766/pexels-photo-1533766.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Борислав Начев', bio: 'Капитан с лиценз RYA Day Skipper.' }, latitude: 38.83, longitude: 20.71, durationDays: 7 },
  { title: 'Хайкинг Доломити', slug: 'hiking-dolomites-2026', type: 'Hiking', shortDescription: 'Осем дни из Доломитите — Alta Via 1.', location: 'Кортина д\'Ампецо, Италия', startDate: '2026-08-01', endDate: '2026-08-09', price: 1490, currency: 'EUR', spotsTotal: 12, tags: ['Hiking', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Стефан Иванов', bio: 'Планински водач, Алпи.' }, latitude: 46.54, longitude: 12.14, durationDays: 8 },
  { title: 'Катерене – Врачански Балкан', slug: 'climbing-vratsa-2026', type: 'Adventure', shortDescription: 'Уикенд курс по скално катерене за начинаещи.', location: 'Враца, България', startDate: '2026-06-13', endDate: '2026-06-15', price: 280, currency: 'BGN', spotsTotal: 8, tags: ['Adventure', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Николай Попов', bio: 'Алпинист, UIAA инструктор.' }, latitude: 43.21, longitude: 23.55, durationDays: 2 },
  { title: 'Сърф в Португалия', slug: 'surf-portugal-2026', type: 'Adventure', shortDescription: 'Седем дни сърф на атлантическото крайбрежие на Португалия.', location: 'Назаре, Португалия', startDate: '2026-08-15', endDate: '2026-08-22', price: 1190, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1654489/pexels-photo-1654489.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Анна Колева', bio: 'Сърф инструктор, 7 години опит.' }, latitude: 39.6, longitude: -9.07, durationDays: 7 },
  { title: 'Колоездене из Тоскана', slug: 'cycling-tuscany-2026', type: 'Adventure', shortDescription: 'Шест дни велосипедна обиколка сред тосканските хълмове.', location: 'Сиена, Италия', startDate: '2026-05-10', endDate: '2026-05-16', price: 1390, currency: 'EUR', spotsTotal: 12, tags: ['Adventure', 'Cultural'], heroImageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Петър Димитров', bio: 'Велосипеден инструктор.' }, latitude: 43.32, longitude: 11.33, durationDays: 6 },
  { title: 'Медитационен ретрийт – Рила', slug: 'meditation-rila-2026', type: 'Wellness', shortDescription: 'Пет дни мълчание и медитация сред рилските гори.', location: 'Рилски Манастир, България', startDate: '2026-09-20', endDate: '2026-09-25', price: 490, currency: 'BGN', spotsTotal: 10, tags: ['Wellness', 'Wellness'], heroImageUrl: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Силвия Тодорова', bio: 'Медитационен учител.' }, latitude: 42.13, longitude: 23.34, durationDays: 5 },
  { title: 'Астрофотография в Родопи', slug: 'astro-rhodopes-2026', type: 'Photography', shortDescription: 'Три нощи нощна фотография под звездното небе на Родопите.', location: 'Смолян, България', startDate: '2026-07-25', endDate: '2026-07-28', price: 390, currency: 'BGN', spotsTotal: 8, tags: ['Photography'], heroImageUrl: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Таня Иванова', bio: 'Астрофотограф.' }, latitude: 41.57, longitude: 24.7, durationDays: 3 },
  { title: 'Wildlife Safari – Уганда', slug: 'safari-uganda-2026', type: 'Hiking', shortDescription: 'Осем дни горили и савана в Уганда.', location: 'Бвинди, Уганда', startDate: '2026-06-10', endDate: '2026-06-18', price: 3490, currency: 'EUR', spotsTotal: 6, tags: ['Adventure', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Христо Георгиев', bio: 'Wildlife safari водач.' }, latitude: -0.9, longitude: 29.67, durationDays: 8 },
  { title: 'Каяк – Черногорски фиорди', slug: 'kayak-montenegro-2026', type: 'Adventure', shortDescription: 'Пет дни каяк в Бока Которска.', location: 'Котор, Черна Гора', startDate: '2026-09-12', endDate: '2026-09-17', price: 890, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Мила Събева', bio: 'Каяк инструктор.' }, latitude: 42.43, longitude: 18.77, durationDays: 5 },
  { title: 'Ски туризъм – Пирин', slug: 'ski-tour-pirin-2027', type: 'Ski', shortDescription: 'Три дни ски туризъм в дивата природа на Пирин.', location: 'Банско, България', startDate: '2027-02-05', endDate: '2027-02-08', price: 450, currency: 'BGN', spotsTotal: 8, tags: ['Ski', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Тодор Маринов', bio: 'Ски инструктор ниво 3.' }, latitude: 41.79, longitude: 23.47, durationDays: 3 },
  { title: 'Йога и серф – Балийски ретрийт', slug: 'yoga-surf-bali-2026', type: 'Yoga', shortDescription: 'Десет дни йога и сърф на Бали — двойно удоволствие.', location: 'Чангу, Бали', startDate: '2026-11-15', endDate: '2026-11-25', price: 1890, currency: 'EUR', spotsTotal: 12, tags: ['Yoga', 'Adventure', 'Wellness'], heroImageUrl: 'https://images.pexels.com/photos/1670770/pexels-photo-1670770.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Десислава Крумова', bio: 'Yoga и mindfulness инструктор.' }, latitude: -8.64, longitude: 115.13, durationDays: 10 },
  { title: 'Via Ferrata – Словения', slug: 'via-ferrata-slovenia-2026', type: 'Adventure', shortDescription: 'Три дни via ferrata маршрути в Юлийските Алпи.', location: 'Бовец, Словения', startDate: '2026-07-17', endDate: '2026-07-20', price: 690, currency: 'EUR', spotsTotal: 8, tags: ['Adventure', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/1368690/pexels-photo-1368690.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Кристиан Петров', bio: 'Via ferrata водач.' }, latitude: 46.34, longitude: 13.55, durationDays: 3 },
  { title: 'Бърд уотчинг – Странджа', slug: 'birdwatching-strandzha-2026', type: 'Adventure', shortDescription: 'Четири дни наблюдение на птици в биосферен резерват Странджа.', location: 'Малко Търново, България', startDate: '2026-05-01', endDate: '2026-05-05', price: 320, currency: 'BGN', spotsTotal: 12, tags: ['Adventure'], heroImageUrl: 'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Боян Тенев', bio: 'Еколог и бърд уотчинг водач.' }, latitude: 41.97, longitude: 27.53, durationDays: 4 },
  { title: 'Рафтинг – Арда', slug: 'rafting-arda-2026', type: 'Adventure', shortDescription: 'Два дни рафтинг по река Арда в сърцето на Родопите.', location: 'Кърджали, България', startDate: '2026-06-27', endDate: '2026-06-28', price: 180, currency: 'BGN', spotsTotal: 16, tags: ['Adventure', 'Adventure'], heroImageUrl: 'https://images.pexels.com/photos/2304647/pexels-photo-2304647.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Мила Събева', bio: 'Каяк и рафтинг инструктор.' }, latitude: 41.64, longitude: 25.37, durationDays: 2 },
  { title: 'Тrekking – Хималаите на Bhutan', slug: 'trekking-bhutan-2026', type: 'Hiking', shortDescription: 'Дванадесет дни в Тигровото гнездо и Druk Path — Бутан неизследван.', location: 'Тхимпху, Бутан', startDate: '2026-10-10', endDate: '2026-10-22', price: 3990, currency: 'EUR', spotsTotal: 8, tags: ['Adventure', 'Cultural'], heroImageUrl: 'https://images.pexels.com/photos/2104742/pexels-photo-2104742.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Александър Василев', bio: 'Хималайски треккинг водач.' }, latitude: 27.47, longitude: 89.64, durationDays: 12 },
  { title: 'Колоездене – Via Francigena', slug: 'cycling-francigena-2026', type: 'Adventure', shortDescription: 'Десет дни по средновековния поклоннически маршрут до Рим.', location: 'Сиена–Рим, Италия', startDate: '2026-09-28', endDate: '2026-10-08', price: 1690, currency: 'EUR', spotsTotal: 10, tags: ['Adventure', 'Cultural'], heroImageUrl: 'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1200', instructor: { name: 'Петър Димитров', bio: 'Велосипеден инструктор.' }, latitude: 41.9, longitude: 12.5, durationDays: 10 },
]

async function seedPrograms(payload: Awaited<ReturnType<typeof getPayload>>, destIds: Record<string, string>) {
  console.log('\n[6] Programs')
  for (const p of PROG_DATA) {
    const ex = await payload.find({ collection: 'programs', where: { slug: { equals: p.slug } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${p.title}`); continue }
    const heroImage = await uploadImage(payload, p.heroImageUrl, p.title, `prog-${p.slug}.jpg`)
    await payload.create({
      collection: 'programs',
      data: {
        title: p.title, slug: p.slug, type: p.type,
        shortDescription: p.shortDescription,
        location: p.location,
        startDate: p.startDate, endDate: p.endDate,
        price: p.price, currency: p.currency as any,
        spotsTotal: p.spotsTotal, spotsAvailable: p.spotsTotal,
        status: 'active',
        tags: p.tags.map(t => ({ tag: t })),
        instructor: p.instructor,
        latitude: p.latitude, longitude: p.longitude,
        durationDays: p.durationDays,
        ...(heroImage ? { heroImage } : {}),
        included: [{ item: 'Настаняване' }, { item: 'Инструктор' }, { item: 'Оборудване' }],
        notIncluded: [{ item: 'Самолетни билети' }, { item: 'Лични разходи' }],
        faq: [{ question: 'Каква подготовка е нужна?', answer: 'Базова физическа форма е достатъчна.' }],
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${p.title}`)
  }
}

// ---------------------------------------------------------------------------
// 7. Gallery Collections (20)
// ---------------------------------------------------------------------------
const GALLERY_DATA = [
  { title: 'Между дюните и звездите: Намибия', slug: 'namibia-dunes-stars', description: 'Намибийската пустиня — тишина и звезди.', coverUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80', photographerIdx: 1, lat: -24.65, lng: 15.28 },
  { title: 'Краят на познатия свят: Сокотра', slug: 'socotra-colors-silence', description: 'Сокотра — извънземната красота на Арабско море.', coverUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=1200&q=80', photographerIdx: 2, lat: 12.46, lng: 53.82 },
  { title: 'Магията на Киргизстан', slug: 'kyrgyzstan-magic', description: 'Планините и орловите ловци на Киргизстан.', coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', photographerIdx: 1, lat: 41.2, lng: 74.76 },
  { title: 'Патагония: Земята на ветровете', slug: 'patagonia-winds', description: 'Торес дел Пайне и ледниците на края на света.', coverUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: -51.6, lng: -72.9 },
  { title: 'Исландия: Огън и лед', slug: 'iceland-fire-ice', description: 'Гейзери, лавови полета и северно сияние.', coverUrl: 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: 64.9, lng: -19.0 },
  { title: 'Мароко: Цветовете на Медината', slug: 'morocco-medina-colors', description: 'Фес, Маракеш — лабиринтите на мирис и цвят.', coverUrl: 'https://images.pexels.com/photos/3889834/pexels-photo-3889834.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: 34.0, lng: -5.0 },
  { title: 'Уганда: Очи на горилата', slug: 'uganda-gorilla-eyes', description: 'Среща с планинските горили в Бвинди.', coverUrl: 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: -0.9, lng: 29.67 },
  { title: 'Непал: Покрива на света', slug: 'nepal-roof-world', description: 'Хималаите отблизо — Annapurna и Everest.', coverUrl: 'https://images.pexels.com/photos/2104742/pexels-photo-2104742.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: 28.0, lng: 84.0 },
  { title: 'Виетнам: Халонг в мъглата', slug: 'vietnam-halong-mist', description: 'Халонг Бей — хиляди острови в изумруденото море.', coverUrl: 'https://images.pexels.com/photos/1482193/pexels-photo-1482193.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: 20.9, lng: 107.1 },
  { title: 'Мадагаскар: Островът на лемурите', slug: 'madagascar-lemurs', description: 'Баобаби, лемури и цветовете на четвъртия свят.', coverUrl: 'https://images.pexels.com/photos/4577793/pexels-photo-4577793.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: -20.0, lng: 47.0 },
  { title: 'Грузия: Кавказки истории', slug: 'georgia-caucasus-tales', description: 'Кули, вино и снежни върхове на Кавказ.', coverUrl: 'https://images.pexels.com/photos/3214958/pexels-photo-3214958.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: 42.3, lng: 43.4 },
  { title: 'Бразилия: Амазония от птичи поглед', slug: 'brazil-amazon-aerial', description: 'Амазонската джунгла — белите дробове на Земята.', coverUrl: 'https://images.pexels.com/photos/2868242/pexels-photo-2868242.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: -3.47, lng: -62.21 },
  { title: 'Перу: Мачу Пикчу в облаците', slug: 'peru-machu-picchu-clouds', description: 'Изгревът над Мачу Пикчу — момент за цял живот.', coverUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: -13.16, lng: -72.54 },
  { title: 'Азорски Острови: Вулкани в Атлантика', slug: 'azores-volcanoes', description: 'Кратерни езера и топли извори на Азорите.', coverUrl: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: 37.7, lng: -25.5 },
  { title: 'Танзания: Серенгети в миграция', slug: 'tanzania-serengeti-migration', description: 'Голямата миграция — един милион животни.', coverUrl: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: -2.33, lng: 34.83 },
  { title: 'Гърция: Острови без туристи', slug: 'greece-hidden-islands', description: 'Левкада, Итака, Кефалония — безлюдните плажове.', coverUrl: 'https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: 38.7, lng: 20.7 },
  { title: 'Норвегия: Фиордите от вода', slug: 'norway-fjords-water', description: 'Гейрангерфиорд и Нерьофиорд — ЮНЕСКО шедьовър.', coverUrl: 'https://images.pexels.com/photos/3369522/pexels-photo-3369522.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: 62.1, lng: 7.2 },
  { title: 'Япония: Цъфтежът на черешите', slug: 'japan-cherry-blossom', description: 'Sakura — японската пролет в розово и бяло.', coverUrl: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: 35.68, lng: 139.69 },
  { title: 'Етиопия: Долината на Омо', slug: 'ethiopia-omo-valley', description: 'Племената на долината Омо — живата история на Африка.', coverUrl: 'https://images.pexels.com/photos/1585658/pexels-photo-1585658.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 2, lat: 5.85, lng: 36.07 },
  { title: 'Боливия: Огледалото на небето', slug: 'bolivia-salt-flats', description: 'Salar de Uyuni — най-голямото огледало на Земята.', coverUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200', photographerIdx: 1, lat: -20.13, lng: -67.49 },
]

async function seedGalleryCollections(payload: Awaited<ReturnType<typeof getPayload>>, userIds: string[]) {
  console.log('\n[7] Gallery Collections')
  const ids: string[] = []
  const photographerIds = userIds.slice(1)
  for (const g of GALLERY_DATA) {
    const ex = await payload.find({ collection: 'gallery-collections', where: { slug: { equals: g.slug } }, limit: 1 })
    if (ex.docs.length > 0) { ids.push(ex.docs[0].id as string); console.log(`  skip: ${g.title}`); continue }
    const coverImage = await uploadImage(payload, g.coverUrl, g.title, `gallery-${g.slug}.jpg`)
    const photographerId = photographerIds[(g.photographerIdx - 1) % photographerIds.length]
    const doc = await payload.create({
      collection: 'gallery-collections',
      data: {
        title: g.title, slug: g.slug, description: g.description,
        status: 'published',
        publishedAt: new Date('2026-01-15').toISOString(),
        latitude: g.lat, longitude: g.lng,
        ...(coverImage ? { coverImage, images: [{ image: coverImage, caption: g.title, featured: true }] } : {}),
        ...(photographerId ? { photographer: photographerId } : {}),
      } as any,
      overrideAccess: true,
    })
    ids.push(doc.id as string)
    console.log(`  created: ${g.title}`)
  }
  return ids
}

// ---------------------------------------------------------------------------
// 8. Blog Posts (20)
// ---------------------------------------------------------------------------
const BLOG_IMAGE_URLS = [
  'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3889834/pexels-photo-3889834.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1200',
]

const BLOG_DATA = [
  { title: 'Топ 10 съвета за планински поход', slug: 'top-10-hiking-tips', excerpt: 'Всичко, което трябва да знаете преди да тръгнете на поход.', catSlug: 'travel-tips', readingTime: 7 },
  { title: 'Защо Рила е задължителна дестинация', slug: 'why-rila-is-must', excerpt: 'Седемте езера, Мусала и тайните на рилските гори.', catSlug: 'destinations', readingTime: 5 },
  { title: 'История от Мачу Пикчу', slug: 'story-machu-picchu', excerpt: 'Изгревът над Мачу Пикчу промени начина, по който виждам света.', catSlug: 'travel-stories', readingTime: 8 },
  { title: 'Горилите на Уганда: Очи в очи', slug: 'uganda-gorillas-face-to-face', excerpt: 'Среща с планинска горила на 2 метра разстояние.', catSlug: 'nature-wildlife', readingTime: 6 },
  { title: 'Как да се подготвим за йога ретрийт', slug: 'how-to-prepare-yoga-retreat', excerpt: 'Практически съвети за първия ви ретрийт.', catSlug: 'travel-tips', readingTime: 5 },
  { title: 'Исландия: 7 места, които трябва да видите', slug: 'iceland-7-places', excerpt: 'От Геотермалните басейни до Вестманнаейяр.', catSlug: 'destinations', readingTime: 9 },
  { title: 'Самотното пътуване: Страхове и свобода', slug: 'solo-travel-fears-freedom', excerpt: 'Как едно самостоятелно пътуване промени живота ми.', catSlug: 'travel-stories', readingTime: 7 },
  { title: 'Мигриращото стадо на Серенгети', slug: 'serengeti-great-migration', excerpt: 'Свидетел на едно от най-великите природни явления.', catSlug: 'nature-wildlife', readingTime: 8 },
  { title: 'Какво да сложим в раницата: Пълен чеклист', slug: 'backpack-complete-checklist', excerpt: 'Пълен списък на задължителното оборудване за трекинг.', catSlug: 'travel-tips', readingTime: 10 },
  { title: 'Непал: Между облаците и боговете', slug: 'nepal-clouds-gods', excerpt: 'Хималайски трекинг — физическо и духовно пътешествие.', catSlug: 'destinations', readingTime: 11 },
  { title: 'Нощта, в която спахме под звездите в Намибия', slug: 'namibia-sleeping-under-stars', excerpt: 'Без палатка, без светлини — само пустинята и Млечният път.', catSlug: 'travel-stories', readingTime: 6 },
  { title: 'Балийският орангутан: Последните гори', slug: 'bali-orangutan-last-forests', excerpt: 'Защо биоразнообразието на Бали е под заплаха.', catSlug: 'nature-wildlife', readingTime: 9 },
  { title: 'Altitude sickness: Как да го избегнем', slug: 'altitude-sickness-prevention', excerpt: 'Медицински съвети за планинарите на голяма височина.', catSlug: 'travel-tips', readingTime: 7 },
  { title: 'Мароко: Медините, за които никой не разказва', slug: 'morocco-secret-medinas', excerpt: 'Скрити квартали на Фес и Маракеш, непознати за туристите.', catSlug: 'destinations', readingTime: 8 },
  { title: 'Когато влакът закъсня 12 часа в Индия', slug: 'india-train-12-hours-late', excerpt: 'Пътуване по грешния начин — и защо беше страхотно.', catSlug: 'travel-stories', readingTime: 6 },
  { title: 'Паткагония: Защо зимата е най-добрият сезон', slug: 'patagonia-winter-best-season', excerpt: 'Малко туристи, много вятър — и тотална свобода.', catSlug: 'destinations', readingTime: 7 },
  { title: 'Фотографирай дивата природа: 8 правила', slug: 'wildlife-photography-8-rules', excerpt: 'Как да снимате животни, без да ги безпокоите.', catSlug: 'nature-wildlife', readingTime: 8 },
  { title: 'Грузинската кухня: 5 ястия, за които ще се върнете', slug: 'georgian-food-5-dishes', excerpt: 'Хинкали, хачапури и натурално вино — добре дошли в Грузия.', catSlug: 'travel-tips', readingTime: 5 },
  { title: 'Виетнам с мотоциклет: Ханой–Хо Ши Мин', slug: 'vietnam-motorbike-north-south', excerpt: '2000 км по Ho Chi Minh Trail на 125cc.', catSlug: 'travel-stories', readingTime: 12 },
  { title: 'Боливия: Солниците, за които ще мечтаете', slug: 'bolivia-salt-flats-dream', excerpt: 'Salar de Uyuni — огледалото на небето на 3600м.', catSlug: 'destinations', readingTime: 7 },
]

async function seedBlogPosts(payload: Awaited<ReturnType<typeof getPayload>>, catIds: Record<string, string>, userIds: string[]) {
  console.log('\n[8] Blog Posts')
  const authorId = userIds[0]
  for (let i = 0; i < BLOG_DATA.length; i++) {
    const b = BLOG_DATA[i]
    const ex = await payload.find({ collection: 'blog-posts', where: { slug: { equals: b.slug } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${b.title}`); continue }
    const heroImage = await uploadImage(payload, BLOG_IMAGE_URLS[i % BLOG_IMAGE_URLS.length], b.title, `blog-${b.slug}.jpg`)
    const catId = catIds[b.catSlug]
    await payload.create({
      collection: 'blog-posts',
      data: {
        title: b.title, slug: b.slug, excerpt: b.excerpt,
        content: rtMulti([b.excerpt, 'Пълното съдържание на тази статия идва скоро. Следете нашия блог за нови публикации.']),
        readingTime: b.readingTime,
        ...(heroImage ? { heroImage } : {}),
        ...(catId ? { categories: [catId] } : {}),
        ...(authorId ? { author: authorId } : {}),
        tags: [{ tag: 'пътуване' }],
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${b.title}`)
  }
}

// ---------------------------------------------------------------------------
// 9. Stories (20)
// ---------------------------------------------------------------------------
const STORY_DATA = [
  { title: 'Как Рила ме промени завинаги', slug: 'rila-changed-me', destSlug: 'rila', authorName: 'Петя Василева' },
  { title: 'Моята среща с горилите в Уганда', slug: 'uganda-gorilla-encounter', destSlug: 'uganda', authorName: 'Мартин Георгиев' },
  { title: 'Мачу Пикчу и пропусканият изгрев', slug: 'machu-picchu-missed-sunrise', destSlug: 'peru', authorName: 'Ива Николова' },
  { title: 'Исландия в средата на зимата', slug: 'iceland-midwinter', destSlug: 'iceland', authorName: 'Димо Стоянов' },
  { title: 'Загубена в медините на Фес', slug: 'lost-in-fes-medinas', destSlug: 'morocco', authorName: 'Биляна Попова' },
  { title: 'Пирин — моят любовен роман', slug: 'pirin-love-affair', destSlug: 'pirin', authorName: 'Красимир Иванов' },
  { title: 'Непал: 21 дни без телефон', slug: 'nepal-21-days-no-phone', destSlug: 'nepal', authorName: 'Миглена Тодорова' },
  { title: 'Как намерих себе си в Родопите', slug: 'rhodopes-finding-myself', destSlug: 'rhodopes', authorName: 'Николета Кирова' },
  { title: 'Патагония: Четири дни буря', slug: 'patagonia-four-days-storm', destSlug: 'patagonia', authorName: 'Светлин Христов' },
  { title: 'Грузия: Вино, кули и невероятни хора', slug: 'georgia-wine-towers-people', destSlug: 'georgia', authorName: 'Теодора Ненкова' },
  { title: 'Виетнам от мотоциклет', slug: 'vietnam-from-motorbike', destSlug: 'vietnam', authorName: 'Борис Петков' },
  { title: 'Мадагаскар: Там, дето Африка е различна', slug: 'madagascar-different-africa', destSlug: 'madagascar', authorName: 'Десислава Маринова' },
  { title: 'Танзания: Килиманджаро с 50 килограма', slug: 'kilimanjaro-50kg', destSlug: 'tanzania', authorName: 'Антон Симеонов' },
  { title: 'Черното море: Нашата непозната дестинация', slug: 'black-sea-unknown', destSlug: 'black-sea', authorName: 'Радина Цонева' },
  { title: 'Азорите: Пет острова, пет живота', slug: 'azores-five-islands-five-lives', destSlug: 'azores', authorName: 'Калин Велчев' },
  { title: 'Бразилия: Карнавал и джунгла', slug: 'brazil-carnival-jungle', destSlug: 'brazil', authorName: 'Стела Иванова' },
  { title: 'Странджа: Тайната природа на България', slug: 'strandzha-secret-nature', destSlug: 'strandzha', authorName: 'Емил Тодоров' },
  { title: 'Велико Търново: Едно утро на Царевец', slug: 'tarnovo-tsarevets-morning', destSlug: 'veliko-tarnovo', authorName: 'Цветелина Ковачева' },
  { title: 'Витоша: Градът под гората', slug: 'vitosha-city-under-forest', destSlug: 'vitosha', authorName: 'Павел Стефанов' },
  { title: 'Стара Планин: Пешеходният маршрут на живота', slug: 'balkan-lifetime-trail', destSlug: 'balkan-mountains', authorName: 'Яна Михайлова' },
]

async function seedStories(payload: Awaited<ReturnType<typeof getPayload>>, destIds: Record<string, string>) {
  console.log('\n[9] Stories')
  for (let i = 0; i < STORY_DATA.length; i++) {
    const s = STORY_DATA[i]
    const ex = await payload.find({ collection: 'stories', where: { slug: { equals: s.slug } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${s.title}`); continue }
    const heroImage = await uploadImage(payload, BLOG_IMAGE_URLS[i % BLOG_IMAGE_URLS.length], s.title, `story-${s.slug}.jpg`)
    const destId = destIds[s.destSlug]
    await payload.create({
      collection: 'stories',
      data: {
        title: s.title, slug: s.slug,
        author: { name: s.authorName },
        content: rtMulti([`Това е историята на ${s.authorName} за дестинацията.`, 'Пълното съдържание идва скоро.']),
        ...(heroImage ? { heroImage } : {}),
        ...(destId ? { destination: destId } : {}),
        meta: { title: s.title, description: `История от ${s.authorName}` },
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${s.title}`)
  }
}

// ---------------------------------------------------------------------------
// 10. Testimonials (20)
// ---------------------------------------------------------------------------
const TESTIMONIAL_DATA = [
  { authorName: 'Петя В.', quote: 'Походът до Рила беше най-доброто решение на живота ми. Организацията — перфектна.', rating: 5, row: 'top' },
  { authorName: 'Мартин Г.', quote: 'Уганда с тях беше магическо преживяване. Ще се върна отново.', rating: 5, row: 'bottom' },
  { authorName: 'Ива Н.', quote: 'Перу надмина всички очаквания. Водачите са изключителни хора.', rating: 5, row: 'top' },
  { authorName: 'Димо С.', quote: 'Исландия зиме е сън. Северното сияние на живо е нещо неописуемо.', rating: 5, row: 'bottom' },
  { authorName: 'Биляна П.', quote: 'Мароко беше трето пътуване с тях — всеки път е по-добро от предишното.', rating: 5, row: 'top' },
  { authorName: 'Красимир И.', quote: 'Пирин есента е забравен рай. Благодаря за чудесно организирания поход.', rating: 5, row: 'bottom' },
  { authorName: 'Миглена Т.', quote: 'Непал промени перспективата ми. 21 дни без телефон — чудото се случи.', rating: 5, row: 'top' },
  { authorName: 'Николета К.', quote: 'Родопите са по-красиви, отколкото си мислех. Ще се върна на ретрийта.', rating: 5, row: 'bottom' },
  { authorName: 'Светлин Х.', quote: 'Патагония с буря и без — невероятна в двата варианта. Топ организация!', rating: 4, row: 'top' },
  { authorName: 'Теодора Н.', quote: 'Грузия е дестинация, която ще препоръчвам на всеки. Кухнята — фантастична.', rating: 5, row: 'bottom' },
  { authorName: 'Борис П.', quote: 'Виетнам от мотоциклет беше мечтата. Сега разбирам защо хората се влюбват в Азия.', rating: 5, row: 'top' },
  { authorName: 'Десислава М.', quote: 'Мадагаскар е едно от тези места, за които трудно намираш думи. Просто — WOW.', rating: 5, row: 'bottom' },
  { authorName: 'Антон С.', quote: 'Изкачих Килиманджаро с техни водачи — безопасно, добре организирано, незабравимо.', rating: 5, row: 'top' },
  { authorName: 'Радина Ц.', quote: 'Черноморието в техния тур откри за мен места, за кои не знаех, че съществуват.', rating: 4, row: 'bottom' },
  { authorName: 'Калин В.', quote: 'Азорските острови са скрита перла. Групата беше невероятна, атмосферата — топла.', rating: 5, row: 'top' },
  { authorName: 'Стела И.', quote: 'Бразилия с тях — Амазония, карнавал, плажове. Всичко беше организирано перфектно.', rating: 5, row: 'bottom' },
  { authorName: 'Емил Т.', quote: 'Странджа е природна тайна на България. Гордея се, че я открих с тези хора.', rating: 5, row: 'top' },
  { authorName: 'Цветелина К.', quote: 'Велико Търново е история ожива. Сутринта на Царевец е нещо магическо.', rating: 5, row: 'bottom' },
  { authorName: 'Павел С.', quote: 'Витоша е на 20 минути от центъра, но с добър водач е съвсем различна.', rating: 4, row: 'top' },
  { authorName: 'Яна М.', quote: 'Ком–Емине беше предизвикателство и победа. Организацията беше на ниво.', rating: 5, row: 'bottom' },
]

async function seedTestimonials(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[10] Testimonials')
  const avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'
  for (let i = 0; i < TESTIMONIAL_DATA.length; i++) {
    const t = TESTIMONIAL_DATA[i]
    const ex = await payload.find({ collection: 'testimonials', where: { authorName: { equals: t.authorName } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${t.authorName}`); continue }
    const avatar = await uploadImage(payload, avatarUrl, t.authorName, `testimonial-avatar-${i}.jpg`)
    await payload.create({
      collection: 'testimonials',
      data: {
        authorName: t.authorName, quote: t.quote, rating: t.rating, row: t.row,
        ...(avatar ? { avatar } : {}),
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${t.authorName}`)
  }
}

// ---------------------------------------------------------------------------
// 11. Product Categories (4)
// ---------------------------------------------------------------------------
async function seedCategories(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[11] Product Categories')
  const cats = [
    { name: 'Екипировка', slug: 'equipment', sortOrder: 1 },
    { name: 'Аксесоари', slug: 'accessories', sortOrder: 2 },
    { name: 'Облекло', slug: 'clothing', sortOrder: 3 },
    { name: 'Книги и Карти', slug: 'books-maps', sortOrder: 4 },
  ]
  const ids: Record<string, string> = {}
  for (const c of cats) {
    const ex = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (ex.docs.length > 0) { ids[c.slug] = ex.docs[0].id as string; console.log(`  skip: ${c.name}`); continue }
    const doc = await payload.create({ collection: 'categories', data: c as any, overrideAccess: true })
    ids[c.slug] = doc.id as string
    console.log(`  created: ${c.name}`)
  }
  return ids
}

// ---------------------------------------------------------------------------
// 12. Products (20)
// ---------------------------------------------------------------------------
const PRODUCT_DATA = [
  { title: 'Трекинг щеки Black Diamond', slug: 'trekking-poles-bd', catSlug: 'equipment', price: 189, compareAtPrice: 220, stock: 30, sku: 'BD-POLES-001', tags: ['hiking', 'trekking'] },
  { title: 'Раница Osprey Atmos 65L', slug: 'backpack-osprey-65', catSlug: 'equipment', price: 450, compareAtPrice: 520, stock: 15, sku: 'OSP-65-001', tags: ['backpack', 'hiking'] },
  { title: 'Фенер Petzl Actik Core', slug: 'headlamp-petzl-actik', catSlug: 'equipment', price: 89, compareAtPrice: 110, stock: 50, sku: 'PTZ-ACTIK-001', tags: ['headlamp', 'camping'] },
  { title: 'Спален чувал Sea to Summit 0°C', slug: 'sleeping-bag-sts-0', catSlug: 'equipment', price: 320, compareAtPrice: 380, stock: 20, sku: 'STS-SB-0C', tags: ['sleeping', 'camping'] },
  { title: 'Яке Patagonia Nano Puff', slug: 'jacket-patagonia-nano', catSlug: 'clothing', price: 290, compareAtPrice: 340, stock: 25, sku: 'PAT-NANO-M', tags: ['jacket', 'warmth'] },
  { title: 'Туристически боти Salomon X Ultra', slug: 'boots-salomon-xultra', catSlug: 'equipment', price: 380, compareAtPrice: 440, stock: 18, sku: 'SAL-XU-42', tags: ['boots', 'hiking'] },
  { title: 'Планинска шапка Buff', slug: 'hat-buff-merino', catSlug: 'clothing', price: 45, stock: 100, sku: 'BUF-MER-001', tags: ['hat', 'merino'] },
  { title: 'Бутилка Hydro Flask 1L', slug: 'bottle-hydro-flask-1l', catSlug: 'accessories', price: 85, compareAtPrice: 95, stock: 60, sku: 'HF-1L-001', tags: ['bottle', 'hydration'] },
  { title: 'Аптечка First Aid Lifesystems', slug: 'first-aid-lifesystems', catSlug: 'accessories', price: 65, stock: 40, sku: 'LFS-FA-001', tags: ['first-aid', 'safety'] },
  { title: 'Топографска карта Рила 1:50000', slug: 'map-rila-topo', catSlug: 'books-maps', price: 18, stock: 200, sku: 'MAP-RILA-50', tags: ['map', 'rila'] },
  { title: 'Туристически гамаши Outdoor Research', slug: 'gaiters-outdoor-research', catSlug: 'equipment', price: 79, stock: 30, sku: 'OR-GAIT-001', tags: ['gaiters', 'hiking'] },
  { title: 'Мерино тениска Icebreaker', slug: 'tshirt-icebreaker-merino', catSlug: 'clothing', price: 110, compareAtPrice: 130, stock: 40, sku: 'ICE-TEE-M', tags: ['merino', 'clothing'] },
  { title: 'Слънцезащитни очила Julbo', slug: 'sunglasses-julbo', catSlug: 'accessories', price: 140, compareAtPrice: 165, stock: 25, sku: 'JUL-SG-001', tags: ['sunglasses', 'uv'] },
  { title: 'Трекинг панталон Fjallraven', slug: 'pants-fjallraven-keb', catSlug: 'clothing', price: 260, compareAtPrice: 300, stock: 20, sku: 'FJL-KEB-32', tags: ['pants', 'trekking'] },
  { title: 'Филтър за вода Sawyer Squeeze', slug: 'water-filter-sawyer', catSlug: 'equipment', price: 55, stock: 50, sku: 'SAW-SQ-001', tags: ['water', 'filter'] },
  { title: 'Туристически хавлия PackTowl', slug: 'towel-packtowl-luxe', catSlug: 'accessories', price: 48, stock: 70, sku: 'PT-LUX-L', tags: ['towel', 'travel'] },
  { title: 'Книга: 100 Върха в България', slug: 'book-100-peaks-bulgaria', catSlug: 'books-maps', price: 28, stock: 150, sku: 'BK-100VRH', tags: ['book', 'hiking', 'bulgaria'] },
  { title: 'Топографска карта Пирин 1:50000', slug: 'map-pirin-topo', catSlug: 'books-maps', price: 18, stock: 200, sku: 'MAP-PIRIN-50', tags: ['map', 'pirin'] },
  { title: 'Дъждобран Marmot PreCip', slug: 'rain-jacket-marmot-precip', catSlug: 'clothing', price: 150, compareAtPrice: 180, stock: 30, sku: 'MAR-PREC-M', tags: ['rain', 'jacket'] },
  { title: 'Навигатор Garmin Instinct 2', slug: 'gps-garmin-instinct2', catSlug: 'accessories', price: 490, compareAtPrice: 560, stock: 12, sku: 'GAR-INS2-001', tags: ['gps', 'navigation'] },
]

const PRODUCT_IMAGE_URL = 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=800'

async function seedProducts(payload: Awaited<ReturnType<typeof getPayload>>, catIds: Record<string, string>) {
  console.log('\n[12] Products')
  for (let i = 0; i < PRODUCT_DATA.length; i++) {
    const p = PRODUCT_DATA[i]
    const ex = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${p.title}`); continue }
    const img = await uploadImage(payload, PRODUCT_IMAGE_URL, p.title, `product-${p.slug}.jpg`)
    const catId = catIds[p.catSlug]
    await payload.create({
      collection: 'products',
      data: {
        title: p.title, slug: p.slug, status: 'active',
        price: p.price,
        ...(p.compareAtPrice ? { compareAtPrice: p.compareAtPrice } : {}),
        stock: p.stock, sku: p.sku,
        description: rt(`${p.title} — висококачествено оборудване за планински туризъм.`),
        tags: p.tags.map(t => ({ tag: t })),
        ...(img ? { images: [{ image: img }] } : {}),
        ...(catId ? { category: catId } : {}),
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${p.title}`)
  }
}

// ---------------------------------------------------------------------------
// 13. Gift Vouchers (20)
// ---------------------------------------------------------------------------
const VOUCHER_DATA = [
  { code: 'GIFT-100-BGN', recipientName: 'Иван Петров', recipientEmail: 'ivan.petrov@example.com', amount: 100, currency: 'BGN', senderName: 'Мария Иванова', message: 'Честит рожден ден!' },
  { code: 'GIFT-200-BGN', recipientName: 'Анна Тодорова', recipientEmail: 'anna.todorova@example.com', amount: 200, currency: 'BGN', senderName: 'Петър Стоянов', message: 'За твоето следващо приключение.' },
  { code: 'GIFT-150-EUR', recipientName: 'Георги Василев', recipientEmail: 'georgi.vasilev@example.com', amount: 150, currency: 'EUR', senderName: 'Семейство Василеви', message: 'Поздрави от семейството!' },
  { code: 'GIFT-300-BGN', recipientName: 'Николай Попов', recipientEmail: 'nikolai.popov@example.com', amount: 300, currency: 'BGN', senderName: 'Офисът', message: 'За твоята почивка — заслужено!' },
  { code: 'GIFT-500-BGN', recipientName: 'Елена Маринова', recipientEmail: 'elena.marinova@example.com', amount: 500, currency: 'BGN', senderName: 'Кристиан Петров', message: 'Честита годишнина!' },
  { code: 'GIFT-250-EUR', recipientName: 'Тодор Начев', recipientEmail: 'todor.nachev@example.com', amount: 250, currency: 'EUR', senderName: 'Приятели', message: 'Много пътешествия напред!' },
  { code: 'GIFT-100-EUR', recipientName: 'Силвия Костова', recipientEmail: 'silvia.kostova@example.com', amount: 100, currency: 'EUR', senderName: 'Родители', message: 'Пътувай, докато си млада.' },
  { code: 'GIFT-400-BGN', recipientName: 'Мила Тодорова', recipientEmail: 'mila.todorova@example.com', amount: 400, currency: 'BGN', senderName: 'Братя и сестри', message: 'Обичаме те!' },
  { code: 'GIFT-180-EUR', recipientName: 'Александър Иванов', recipientEmail: 'alex.ivanov@example.com', amount: 180, currency: 'EUR', senderName: 'Компанията', message: 'Награда за годината!' },
  { code: 'GIFT-220-BGN', recipientName: 'Десислава Петрова', recipientEmail: 'desi.petrova@example.com', amount: 220, currency: 'BGN', senderName: 'Иван Петров', message: 'За теб, скъпа.' },
  { code: 'GIFT-350-BGN', recipientName: 'Боян Стоилов', recipientEmail: 'boyan.stoilov@example.com', amount: 350, currency: 'BGN', senderName: 'Клуб планинари', message: 'Продължавай да изкачваш!' },
  { code: 'GIFT-120-EUR', recipientName: 'Виктория Цонева', recipientEmail: 'viki.tsoneva@example.com', amount: 120, currency: 'EUR', senderName: 'Приятели', message: 'Да видиш света!' },
  { code: 'GIFT-600-BGN', recipientName: 'Стефан Георгиев', recipientEmail: 'stefan.georgiev@example.com', amount: 600, currency: 'BGN', senderName: 'Семейство', message: 'Честит Нова Година!' },
  { code: 'GIFT-75-EUR', recipientName: 'Таня Иванова', recipientEmail: 'tanya.ivanova@example.com', amount: 75, currency: 'EUR', senderName: 'Колеги', message: 'Релакс и приключения!' },
  { code: 'GIFT-280-BGN', recipientName: 'Радослав Ненов', recipientEmail: 'rado.nenov@example.com', amount: 280, currency: 'BGN', senderName: 'Мария Ненова', message: 'Зарежи се с природа!' },
  { code: 'GIFT-450-EUR', recipientName: 'Лиляна Стоилова', recipientEmail: 'lili.stoilova@example.com', amount: 450, currency: 'EUR', senderName: 'Родители', message: 'Подаръкът на живота!' },
  { code: 'GIFT-90-BGN', recipientName: 'Кирил Данаилов', recipientEmail: 'kiril.danailov@example.com', amount: 90, currency: 'BGN', senderName: 'Братовчед', message: 'Хайде, давай!' },
  { code: 'GIFT-200-EUR', recipientName: 'Антония Маринова', recipientEmail: 'antonia.marinova@example.com', amount: 200, currency: 'EUR', senderName: 'Шеф', message: 'Перфектен служител!' },
  { code: 'GIFT-130-BGN', recipientName: 'Яна Тодорова', recipientEmail: 'yana.todorova@example.com', amount: 130, currency: 'BGN', senderName: 'Приятели', message: 'Приключения без край!' },
  { code: 'GIFT-320-BGN', recipientName: 'Пламен Христов', recipientEmail: 'plamen.hristov@example.com', amount: 320, currency: 'BGN', senderName: 'Семейство', message: 'Честит Свети Валентин!' },
]

async function seedGiftVouchers(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n[13] Gift Vouchers')
  const coverUrl = 'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=800'
  for (let i = 0; i < VOUCHER_DATA.length; i++) {
    const v = VOUCHER_DATA[i]
    const ex = await payload.find({ collection: 'gift-vouchers', where: { code: { equals: v.code } }, limit: 1 })
    if (ex.docs.length > 0) { console.log(`  skip: ${v.code}`); continue }
    const coverImage = i === 0 ? await uploadImage(payload, coverUrl, 'Gift Voucher Cover', 'gift-voucher-cover.jpg') : undefined
    await payload.create({
      collection: 'gift-vouchers',
      data: {
        code: v.code,
        recipientName: v.recipientName, recipientEmail: v.recipientEmail,
        amount: v.amount, currency: v.currency as any,
        status: 'active',
        expiresAt: new Date('2027-12-31').toISOString(),
        isStorefrontPurchasable: true, isGift: true,
        senderName: v.senderName, senderEmail: 'sender@example.com',
        message: v.message,
        ...(coverImage ? { coverImage } : {}),
      } as any,
      overrideAccess: true,
    })
    console.log(`  created: ${v.code}`)
  }
}

// ---------------------------------------------------------------------------
// 14. Globals
// ---------------------------------------------------------------------------
async function seedGlobals(
  payload: Awaited<ReturnType<typeof getPayload>>,
  destIds: Record<string, string>,
  galleryIds: string[],
) {
  console.log('\n[14] Globals')

  const heroImg = await uploadImage(payload, 'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Hero background', 'global-hero-bg.jpg')
  const shopImg = await uploadImage(payload, 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Shop hero', 'global-shop-hero.jpg')

  // SiteSettings
  await payload.updateGlobal({ slug: 'site-settings', data: {
    siteName: 'Синовете на Планините',
    siteDescription: 'Организирани планински пътувания, трекинг и приключения в България и по света.',
    contactEmail: 'info@sonsofmountains.bg',
    contactPhone: '+359 88 888 8888',
    maintenanceMode: false,
  } as any, overrideAccess: true })
  console.log('  global: site-settings')

  // Hero
  await payload.updateGlobal({ slug: 'hero', data: {
    headline: 'Открий планините. Открий себе си.',
    subtext: 'Организирани походи и приключения в България и по света с опитни водачи.',
    ctaLabel: 'Виж програмата',
    ctaUrl: '/calendar',
    ...(heroImg ? { backgroundImage: heroImg } : {}),
  } as any, overrideAccess: true })
  console.log('  global: hero')

  // WhyTravelWithUs
  await payload.updateGlobal({ slug: 'why-travel-with-us', data: {
    heading: 'Защо да пътуваш с нас',
    items: [
      { icon: 'shield', title: 'Безопасност', body: 'Всички наши водачи са сертифицирани и обучени за планинско спасяване.' },
      { icon: 'users', title: 'Малки групи', body: 'Максимум 14 човека — за по-автентично и лично преживяване.' },
      { icon: 'map', title: 'Уникални маршрути', body: 'Избираме пътеки, които повечето туристи никога не намират сами.' },
      { icon: 'heart', title: 'Страст към природата', body: 'Обичаме планините и искаме да споделим тази обич с теб.' },
      { icon: 'camera', title: 'Невероятни снимки', body: 'Наши фотографи документират всяко пътуване за спомен.' },
    ],
    ctaLabel: 'Научи повече за нас',
    ctaHref: '/about',
  } as any, overrideAccess: true })
  console.log('  global: why-travel-with-us')

  // DestinationCarousel
  const featuredDestSlugs = ['rila', 'pirin', 'iceland', 'morocco', 'nepal']
  const featuredDestIds = featuredDestSlugs.map(s => destIds[s]).filter(Boolean)
  await payload.updateGlobal({ slug: 'destination-carousel', data: {
    sectionTitle: 'Нашите дестинации',
    destinationSource: 'manual',
    selectedDestinations: featuredDestIds.map(id => ({ destination: id })),
  } as any, overrideAccess: true })
  console.log('  global: destination-carousel')

  // TestimonialsSection
  await payload.updateGlobal({ slug: 'testimonials-section', data: {
    heading: 'Какво казват пътешествениците',
    subheading: 'Над 500 доволни участника от 2018 насам.',
  } as any, overrideAccess: true })
  console.log('  global: testimonials-section')

  // CalendarCta
  await payload.updateGlobal({ slug: 'calendar-cta', data: {
    heading: 'Готов за следващото приключение?',
    subheading: 'Разгледай всички предстоящи пътувания и резервирай своето място.',
    buttonText: 'Виж програмата',
    buttonUrl: '/calendar',
  } as any, overrideAccess: true })
  console.log('  global: calendar-cta')

  // Gallery
  await payload.updateGlobal({ slug: 'gallery', data: {
    heading: 'Фото галерии от нашите дестинации',
    subheading: 'Разгледай снимки от наши приключения по света.',
    ctaLabel: 'Виж всички снимки',
    featuredCollections: galleryIds.slice(0, 3).map(id => ({ collection: id })),
  } as any, overrideAccess: true })
  console.log('  global: gallery')

  // Shop
  await payload.updateGlobal({ slug: 'shop', data: {
    heroTitle: 'Магазин за планинско оборудване',
    heroSubtitle: 'Всичко нужно за твоето следващо приключение.',
    loyaltyPointsPerEur: 10,
    loyaltyRedemptionRate: 0.01,
    bnplMinOrderAmount: 200,
    freeShippingThreshold: 100,
    ...(shopImg ? { heroImage: shopImg } : {}),
  } as any, overrideAccess: true })
  console.log('  global: shop')

  // Footer
  await payload.updateGlobal({ slug: 'footer', data: {
    subscribeHeading: 'Абонирай се за нашия бюлетин',
    subscribeSubtext: 'Нови дестинации, ранни птичи оферти и вдъхновение.',
    followHeading: 'Следвай ни',
    followSubtext: 'Ежедневни снимки от планините.',
    facebookFollowers: '8 500',
    instagramFollowers: '12 300',
    copyright: `© ${new Date().getFullYear()} Синовете на Планините. Всички права запазени.`,
  } as any, overrideAccess: true })
  console.log('  global: footer')

  console.log('  globals: done')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== FULL SEED START ===')
  const payload = await getPayload({ config })

  const catIds = await seedBlogCategories(payload)
  const userIds = await seedUsers(payload)
  const destIds = await seedDestinations(payload)
  const guideIds = await seedGuides(payload)
  await seedTrips(payload, destIds, guideIds)
  await seedPrograms(payload, destIds)
  const galleryIds = await seedGalleryCollections(payload, userIds)
  await seedBlogPosts(payload, catIds, userIds)
  await seedStories(payload, destIds)
  await seedTestimonials(payload)
  const prodCatIds = await seedCategories(payload)
  await seedProducts(payload, prodCatIds)
  await seedGiftVouchers(payload)
  await seedGlobals(payload, destIds, galleryIds)

  console.log('\n=== FULL SEED COMPLETE ===')
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
