/**
 * Gallery seed script.
 * Downloads placeholder images to public/seed/gallery/ and seeds:
 * - 2 photographer users
 * - 3 GalleryCollections (Namibia, Socotra, Kyrgyzstan)
 * - Gallery global with all 3 as featured
 *
 * Run: bun src/seed/gallery.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEED_DIR = path.resolve(__dirname, '../../public/seed/gallery')

// Unsplash source images (public domain / free to use for seeding)
const SEED_IMAGES: { filename: string; url: string; alt: string }[] = [
  { filename: 'namibia-dunes.jpg', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80', alt: 'Namibia sand dunes' },
  { filename: 'namibia-rocks.jpg', url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80', alt: 'Namibia rock formations' },
  { filename: 'namibia-stars.jpg', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80', alt: 'Namibia night sky' },
  { filename: 'socotra-dragon-tree.jpg', url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=1200&q=80', alt: 'Socotra dragon blood tree' },
  { filename: 'socotra-beach.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', alt: 'Socotra white sand beach' },
  { filename: 'socotra-sunset.jpg', url: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=1200&q=80', alt: 'Socotra sunset dunes' },
  { filename: 'kyrgyzstan-mountains.jpg', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', alt: 'Kyrgyzstan mountain range' },
  { filename: 'kyrgyzstan-eagle.jpg', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80', alt: 'Kyrgyzstan eagle hunter' },
  { filename: 'avatar-1.jpg', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', alt: 'Photographer avatar 1' },
  { filename: 'avatar-2.jpg', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', alt: 'Photographer avatar 2' },
]

async function downloadImage(url: string, dest: string) {
  if (fs.existsSync(dest)) {
    console.log(`  skip (exists): ${path.basename(dest)}`)
    return
  }
  console.log(`  downloading: ${path.basename(dest)}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const file = fs.createWriteStream(dest)
  await pipeline(Readable.fromWeb(res.body as any), file)
}

async function main() {
  fs.mkdirSync(SEED_DIR, { recursive: true })

  console.log('\n[1/4] Downloading seed images...')
  for (const img of SEED_IMAGES) {
    await downloadImage(img.url, path.join(SEED_DIR, img.filename))
  }

  console.log('\n[2/4] Initializing Payload...')
  const payload = await getPayload({ config })

  console.log('\n[3/4] Creating photographer users...')

  const createMediaFromSeed = async (filename: string, alt: string) => {
    const filePath = path.join(SEED_DIR, filename)
    const data = fs.readFileSync(filePath)
    const file = {
      data,
      mimetype: 'image/jpeg',
      name: filename,
      size: data.length,
    }
    const media = await payload.create({ collection: 'media', data: { alt }, file, overrideAccess: true })
    return media
  }

  const avatar1 = await createMediaFromSeed('avatar-1.jpg', 'Photographer avatar - Dimitar')
  const avatar2 = await createMediaFromSeed('avatar-2.jpg', 'Photographer avatar - Rumyana')

  const existingUser1 = await payload.find({ collection: 'users', where: { username: { equals: 'dimitar-karanikolov' } }, limit: 1 })
  const user1 = existingUser1.docs[0] ?? await payload.create({
    collection: 'users',
    data: {
      name: 'ДимитърАраниколов',
      email: 'dimitar.karanikolov@seed.test',
      username: 'dimitar-karanikolov',
      password: 'seed-password-change-me',
      role: 'editor',
      instagramHandle: '@d.karanikolov',
      bio: 'Пътуващ фотограф. Намибия, Етиопия, Централна Азия.',
      profileImage: avatar1.id,
    } as any,
    overrideAccess: true,
  })
  console.log('  user1:', user1.id)

  const existingUser2 = await payload.find({ collection: 'users', where: { username: { equals: 'rumyana-boseva' } }, limit: 1 })
  const user2 = existingUser2.docs[0] ?? await payload.create({
    collection: 'users',
    data: {
      name: 'Румяна Бозева',
      email: 'rumyana.boseva@seed.test',
      username: 'rumyana-boseva',
      password: 'seed-password-change-me',
      role: 'editor',
      instagramHandle: '@rumyana_boseva',
      bio: 'Фотограф и пътешественик. Специализира в пейзажна и портретна фотография.',
      profileImage: avatar2.id,
    } as any,
    overrideAccess: true,
  })
  console.log('  user2:', user2.id)

  console.log('\n[4/4] Creating gallery collections...')

  const namibiaCover = await createMediaFromSeed('namibia-dunes.jpg', 'Namibia sand dunes at sunset')
  const namibiaRocks = await createMediaFromSeed('namibia-rocks.jpg', 'Ancient rock formations in Namibia')
  const namibiaStars = await createMediaFromSeed('namibia-stars.jpg', 'Milky Way over Namibia desert')

  const socotraCover = await createMediaFromSeed('socotra-dragon-tree.jpg', 'Iconic dragon blood tree on Socotra')
  const socotraBeach = await createMediaFromSeed('socotra-beach.jpg', 'Pristine beach on Socotra island')
  const socotraSunset = await createMediaFromSeed('socotra-sunset.jpg', 'Sunset over Socotra dunes')

  const kyrgyzstanCover = await createMediaFromSeed('kyrgyzstan-mountains.jpg', 'Snow-capped peaks of Kyrgyzstan')
  const kyrgyzstanEagle = await createMediaFromSeed('kyrgyzstan-eagle.jpg', 'Eagle hunter tradition in Kyrgyzstan')

  const existing1 = await payload.find({ collection: 'gallery-collections', where: { slug: { equals: 'namibia-dunes-stars' } }, limit: 1 })
  const col1 = existing1.docs[0] ?? await payload.create({
    collection: 'gallery-collections',
    data: {
      title: 'Между дюните и звездите: Намибия отблизо',
      slug: 'namibia-dunes-stars',
      description: 'Намибийската пустиня крие тишина, каквато рядко се среща. Димитър Карниколов улавя момента между деня и нощта, когато дюните светят в оранжево и звездите започват да изпълват небето.',
      coverImage: namibiaCover.id,
      photographer: user1.id,
      status: 'published',
      publishedAt: new Date('2026-01-15').toISOString(),
      latitude: -24.65,
      longitude: 15.28,
      images: [
        { image: namibiaCover.id, caption: 'Дюните на Sossusvlei', featured: true },
        { image: namibiaRocks.id, caption: 'Spitzkoppe — гранитни исполини' },
        { image: namibiaStars.id, caption: 'Млечният път над пустинята', featured: true },
      ],
    } as any,
    overrideAccess: true,
  })
  console.log('  collection1:', col1.id)

  const existing2 = await payload.find({ collection: 'gallery-collections', where: { slug: { equals: 'socotra-colors-silence' } }, limit: 1 })
  const col2 = existing2.docs[0] ?? await payload.create({
    collection: 'gallery-collections',
    data: {
      title: 'Краят на познатия свят: Сокотра в цветове и тишина',
      slug: 'socotra-colors-silence',
      description: 'Сокотра не прилича на никое друго място. Румяна Бозева улавя тази извънземна енергия в кадри, които мирищат на сол и прах.',
      coverImage: socotraCover.id,
      photographer: user2.id,
      status: 'published',
      publishedAt: new Date('2026-02-10').toISOString(),
      latitude: 12.46,
      longitude: 53.82,
      images: [
        { image: socotraCover.id, caption: 'Драконово дърво на Сокотра', featured: true },
        { image: socotraBeach.id, caption: 'Белите пясъци на Qalansiyah' },
        { image: socotraSunset.id, caption: 'Залез над пустинята', featured: true },
      ],
    } as any,
    overrideAccess: true,
  })
  console.log('  collection2:', col2.id)

  const existing3 = await payload.find({ collection: 'gallery-collections', where: { slug: { equals: 'kyrgyzstan-magic' } }, limit: 1 })
  const col3 = existing3.docs[0] ?? await payload.create({
    collection: 'gallery-collections',
    data: {
      title: 'Магията на Киргизстан',
      slug: 'kyrgyzstan-magic',
      description: 'Планините на Киргизстан крият традиции, преживели векове. Ловците с орли, юртите и вечните снегове.',
      coverImage: kyrgyzstanCover.id,
      photographer: user1.id,
      status: 'published',
      publishedAt: new Date('2026-03-05').toISOString(),
      latitude: 41.2,
      longitude: 74.76,
      images: [
        { image: kyrgyzstanCover.id, caption: 'Tian Shan — небесните планини', featured: true },
        { image: kyrgyzstanEagle.id, caption: 'Беркутчи — ловец с орел' },
      ],
    } as any,
    overrideAccess: true,
  })
  console.log('  collection3:', col3.id)

  console.log('\n[5/5] Updating Gallery global...')
  await payload.updateGlobal({
    slug: 'gallery',
    data: {
      heading: 'Фото галерии от нашите дестинации',
      subheading: 'Разгледай снимки от наши приключения по света. От джунглите на Коста Рика до пустините на Намибия, всяка галерия е история, уловена в кадър.',
      ctaLabel: 'Виж всички снимки',
      featuredCollections: [
        { collection: col1.id },
        { collection: col2.id },
        { collection: col3.id },
      ],
    } as any,
    overrideAccess: true,
  })

  console.log('\nSeed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
