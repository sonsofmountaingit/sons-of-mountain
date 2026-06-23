import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { CTABlock } from '../blocks/CTABlock'
import { DestinationCarouselBlock } from '../blocks/DestinationCarouselBlock'
import { FAQBlock } from '../blocks/FAQBlock'
import { HeroBlock } from '../blocks/HeroBlock'
import { ImageGalleryBlock } from '../blocks/ImageGalleryBlock'
import { MediaLogosBlock } from '../blocks/MediaLogosBlock'
import { QuoteBlock } from '../blocks/QuoteBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { StoriesBlock } from '../blocks/StoriesBlock'
import { TeamBlock } from '../blocks/TeamBlock'
import { TextBlock } from '../blocks/TextBlock'
import { VideoBlock } from '../blocks/VideoBlock'

const syncToNavigation: CollectionAfterChangeHook = async ({ doc, req }) => {
  const placement: string = doc?.navigationPlacement?.placement ?? 'none'
  if (placement === 'none') return doc

  const label: string = doc?.navigationPlacement?.label || doc?.title || ''
  const href: string = `/${doc.slug}`

  const navDoc = await req.payload.findGlobal({ slug: 'navigation' })
  const leftLinks: { label: string; href: string }[] = (navDoc.navLinksLeft as { label: string; href: string }[] | null) ?? []
  const rightLinks: { label: string; href: string }[] = (navDoc.navLinksRight as { label: string; href: string }[] | null) ?? []

  const removeFrom = (arr: { label: string; href: string }[]) =>
    arr.filter((l) => l.href !== href)

  let newLeft = removeFrom(leftLinks)
  let newRight = removeFrom(rightLinks)

  if (placement === 'left') newLeft = [...newLeft, { label, href }]
  if (placement === 'right') newRight = [...newRight, { label, href }]

  await req.payload.updateGlobal({
    slug: 'navigation',
    data: { navLinksLeft: newLeft, navLinksRight: newRight },
  })

  after(() => { try { revalidateTag('navigation', 'max') } catch {} })
  return doc
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        const secret = process.env.PAYLOAD_SECRET ?? 'fallback-secret'
        const slug = (data as { slug?: string })?.slug ?? ''
        return `${base}/api/preview?collection=pages&slug=${encodeURIComponent(slug)}&secret=${encodeURIComponent(secret)}`
      },
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    preview: ({ slug }) => {
      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const secret = process.env.PAYLOAD_SECRET ?? 'fallback-secret'
      return `${base}/api/preview?collection=pages&slug=${encodeURIComponent((slug as string) ?? '')}&secret=${encodeURIComponent(secret)}`
    },
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/VisualEditorButton#VisualEditorButton',
        },
      },
    },
    {
      name: 'puckData',
      type: 'json',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      admin: {
        description: 'Legacy block editor. Use the Visual Editor above for a full canvas experience.',
      },
      blocks: [
        HeroBlock,
        TextBlock,
        RichTextBlock,
        CTABlock,
        QuoteBlock,
        FAQBlock,
        ImageGalleryBlock,
        VideoBlock,
        TeamBlock,
        MediaLogosBlock,
        StoriesBlock,
        DestinationCarouselBlock,
      ],
    },
    {
      name: 'navigationPlacement',
      type: 'group',
      label: 'Navigation',
      admin: { position: 'sidebar', description: 'Add this page to a navigation group.' },
      fields: [
        {
          name: 'placement',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Left nav', value: 'left' },
            { label: 'Right nav', value: 'right' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          admin: { description: 'Defaults to page title if left blank.' },
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  hooks: {
    afterChange: [syncToNavigation, revalidateCollection('pages', '/')],
    afterDelete: [revalidateCollectionDelete('pages', '/')],
  },
}
