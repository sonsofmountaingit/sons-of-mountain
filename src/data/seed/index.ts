import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding destinations...')

  const destinations = [
    { name: 'Азорски Острови', slug: 'azores', introText: 'Вулканичните острови на Атлантика — зелени, диви и невероятни.' },
    { name: 'Уганда', slug: 'uganda', introText: 'Сърцето на Африка — горили, савани и нескончаема природа.' },
    { name: 'Бразилия', slug: 'brazil', introText: 'Амазония, Рио и карнавалният дух на Южна Америка.' },
    { name: 'Мароко', slug: 'morocco', introText: 'Пустини, медини и синьото и бялото на Шефшауен.' },
    { name: 'Намибия', slug: 'namibia', introText: 'Пясъчните дюни на Sossusvlei и дивата природа на Etosha.' },
    { name: 'Венецуела', slug: 'venezuela', introText: 'Водопадът Анхел и загадъчните тепуи.' },
    { name: 'Тенерифе', slug: 'tenerife', introText: 'Вулканът Тейде, черни плажове и вечно лято.' },
    { name: 'Етиопия', slug: 'ethiopia', introText: 'Лалибела, Даналил и хилядолетната история на Африка.' },
  ]

  for (const dest of destinations) {
    const existing = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: dest.slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'destinations',
        data: {
          name: dest.name,
          slug: dest.slug,
          introText: dest.introText,
          fitnessRatings: { difficulty: 50, comfort: 60, nature: 80, culture: 70 },
        },
      })
      console.log(`  ✓ ${dest.name}`)
    } else {
      console.log(`  - ${dest.name} (already exists)`)
    }
  }

  console.log('\nSeeding pages...')

  const pages: Array<{ title: string; slug: string; headline: string; subheadline: string }> = [
    { title: 'Home', slug: 'home', headline: 'Sons of Mountains', subheadline: 'Преоткривай света с нас' },
    { title: 'About', slug: 'about', headline: 'За нас', subheadline: 'Кои сме ние и защо го правим' },
    { title: 'Blog', slug: 'blog', headline: 'Блог', subheadline: 'Истории от пътя' },
    { title: 'Calendar', slug: 'calendar', headline: 'Календар', subheadline: 'Предстоящи пътувания' },
    { title: 'Contact', slug: 'contact', headline: 'Контакти', subheadline: 'Свържи се с нас' },
    { title: 'Destinations', slug: 'destinations', headline: 'Дестинации', subheadline: 'Накъде поемаме' },
    { title: 'Empire', slug: 'empire', headline: 'Empire', subheadline: '' },
    { title: 'Gallery', slug: 'gallery', headline: 'Галерия', subheadline: '' },
    { title: 'Gift', slug: 'gift', headline: 'Подарък', subheadline: '' },
    { title: 'Legal', slug: 'legal', headline: 'Правна информация', subheadline: '' },
    { title: 'No Limit', slug: 'nolimit', headline: 'No Limit', subheadline: '' },
    { title: 'Photos', slug: 'photos', headline: 'Снимки', subheadline: '' },
    { title: 'Shop', slug: 'shop', headline: 'Магазин', subheadline: '' },
    { title: 'Stories', slug: 'stories', headline: 'Истории', subheadline: '' },
  ]

  for (const p of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: p.title,
          slug: p.slug,
          layout: [
            {
              blockType: 'hero',
              headline: p.headline,
              subheadline: p.subheadline,
              variant: 'default',
              bgColor: '#0a0a0a',
              textColor: '#ffffff',
            },
          ],
        },
      })
      console.log(`  ✓ ${p.title}`)
    } else {
      console.log(`  - ${p.title} (already exists)`)
    }
  }

  console.log('\nSeeding complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
