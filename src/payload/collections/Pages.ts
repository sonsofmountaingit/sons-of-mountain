import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
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
    afterChange: [revalidateCollection('pages', '/')],
    afterDelete: [revalidateCollectionDelete('pages', '/')],
  },
}
