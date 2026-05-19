import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getShopData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [shop, categories, featuredProducts, featuredBundles] = await Promise.all([
      payload.findGlobal({ slug: 'shop', depth: 2 }),
      payload.find({ collection: 'categories', where: { parent: { exists: false } }, sort: 'sortOrder', limit: 20, depth: 1 }),
      payload.find({ collection: 'products', where: { status: { equals: 'active' } }, sort: '-createdAt', limit: 8, depth: 1 }),
      payload.find({ collection: 'bundles', where: { isActive: { equals: true } }, sort: '-createdAt', limit: 4, depth: 2 }),
    ])
    return { shop, categories: categories.docs, featuredProducts: featuredProducts.docs, featuredBundles: featuredBundles.docs }
  },
  ['shop-data'],
  { tags: ['shop', 'categories', 'products', 'bundles'], revalidate: 3600 }
)

export async function GET() {
  const data = await getShopData()
  return NextResponse.json(data)
}
