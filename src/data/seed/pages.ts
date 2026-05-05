import { getPayload } from 'payload'
import config from '@payload-config'

async function seedPages() {
  const payload = await getPayload({ config })

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

  console.log('\nPages seeding complete.')
  process.exit(0)
}

seedPages().catch((err) => {
  console.error(err)
  process.exit(1)
})
