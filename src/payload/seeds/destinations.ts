import { getPayload } from 'payload'
import config from '@payload-config'

const DESTINATIONS = [
  {
    name: 'Азорски Острови',
    slug: 'azores',
    introText: 'Вулканични острови в средата на Атлантическия океан, покрити с изумруденозелена природа, кратерни езера и горещи извори.',
    heroImageUrl: 'https://picsum.photos/seed/azores/1200/800',
    fitnessRatings: { difficulty: 40, comfort: 70, nature: 95, culture: 60 },
  },
  {
    name: 'Уганда',
    slug: 'uganda',
    introText: 'Домът на планинските горили — едно от най-вълнуващите wildlife преживявания на планетата, сред буйни джунгли и савани.',
    heroImageUrl: 'https://picsum.photos/seed/uganda/1200/800',
    fitnessRatings: { difficulty: 65, comfort: 50, nature: 98, culture: 70 },
  },
  {
    name: 'Бразилия',
    slug: 'brazil',
    introText: 'От Амазония до белите пясъци на Ленсойс Мараньенсис — страна на контрасти, цветове и незабравима природа.',
    heroImageUrl: 'https://picsum.photos/seed/brazil/1200/800',
    fitnessRatings: { difficulty: 50, comfort: 60, nature: 90, culture: 85 },
  },
]

async function seed() {
  const payload = await getPayload({ config })

  for (const dest of DESTINATIONS) {
    const existing = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: dest.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Destination "${dest.name}" already exists, skipping.`)
      continue
    }

    let mediaId: string | undefined

    try {
      const imageRes = await fetch(dest.heroImageUrl)
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer())
      const filename = `${dest.slug}-hero.jpg`

      const mediaDoc = await payload.create({
        collection: 'media',
        data: { alt: dest.name },
        file: {
          data: imageBuffer,
          mimetype: 'image/jpeg',
          name: filename,
          size: imageBuffer.length,
          type: 'image/jpeg',
        } as any,
      })
      mediaId = mediaDoc.id as string
      console.log(`Uploaded hero image for "${dest.name}"`)
    } catch (e) {
      console.warn(`Could not upload image for "${dest.name}", proceeding without it.`)
    }

    await payload.create({
      collection: 'destinations',
      data: {
        name: dest.name,
        slug: dest.slug,
        introText: dest.introText,
        ...(mediaId ? { heroImage: mediaId as any } : {}),
        fitnessRatings: dest.fitnessRatings,
      },
    })

    console.log(`Created destination: ${dest.name}`)
  }

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
