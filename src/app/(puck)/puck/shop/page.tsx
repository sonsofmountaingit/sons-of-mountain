import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckShopEditorClient } from './PuckShopEditorClient'

async function EditorContent() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const s = (await payload.findGlobal({ slug: 'shop', depth: 2 })) as any

  const puckData: Data = s?.puckData?.content?.length ? s.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'ShopHeroBlock',
        props: {
          id: 'shop-hero',
          title: s?.heroTitle ?? 'Adventure Shop',
          subtitle: s?.heroSubtitle ?? 'Discover our collection',
          imageUrl: (typeof s?.heroImage === 'object' && s?.heroImage?.url) ? s.heroImage.url : '',
        },
      },
      {
        type: 'ShopFeaturedBlock',
        props: {
          id: 'shop-featured',
          title: s?.featuredTitle ?? 'Featured Categories',
          items: s?.featuredCategories ?? [],
        },
      },
      {
        type: 'ShopBannerBlock',
        props: {
          id: 'shop-banner',
          text: s?.bannerText ?? 'Free shipping over €100',
          cta: s?.bannerCta ?? 'Shop Now',
          ctaHref: s?.bannerCtaHref ?? '/shop',
        },
      },
      {
        type: 'GiftVoucherPromoBlock',
        props: {
          id: 'gift-voucher',
          title: s?.voucherTitle ?? 'Gift Vouchers',
          description: s?.voucherDescription ?? 'Give the gift of adventure',
        },
      },
      {
        type: 'BundleShowcaseBlock',
        props: {
          id: 'bundle-showcase',
          title: s?.bundleTitle ?? 'Shop Bundles',
        },
      },
    ],
  }

  return <PuckShopEditorClient initialData={puckData} />
}

export default async function PuckShopPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  )
}
