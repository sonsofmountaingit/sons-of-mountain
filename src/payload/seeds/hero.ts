import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  const imageUrl = 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1920'
  const imageRes = await fetch(imageUrl)
  const imageBuffer = Buffer.from(await imageRes.arrayBuffer())

  const mediaDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Hero background' },
    file: {
      data: imageBuffer,
      mimetype: 'image/jpeg',
      name: 'hero-background.jpg',
      size: imageBuffer.length,
      type: 'image/jpeg',
    } as any,
  })

  console.log('Uploaded hero image:', mediaDoc.id)

  await payload.updateGlobal({
    slug: 'hero',
    data: {
      backgroundImage: mediaDoc.id as any,
    },
    overrideAccess: true,
  })

  console.log('Hero global updated.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
