import type { GlobalConfig } from 'payload'
import { after } from 'next/server'
import { revalidateTag as _revalidateTag } from 'next/cache'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = _revalidateTag
import { revalidateGlobal } from '../hooks/revalidate'

const revalidateCarouselTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { try { revalidateTag('destination-carousel', 'max') } catch {} })
  } catch { /* outside request scope */ }
  return doc
}

export const DestinationCarousel: GlobalConfig = {
  slug: 'destination-carousel',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/DestinationCarouselVisualEditorButton#DestinationCarouselVisualEditorButton',
        },
      },
    },
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'Дестинации',
    },
    {
      name: 'destinationSource',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Автоматично (всички дестинации)', value: 'auto' },
        { label: 'Ръчно избрани', value: 'manual' },
      ],
    },
    {
      name: 'selectedDestinations',
      type: 'array',
      label: 'Избрани дестинации (ръчно)',
      admin: {
        condition: (_, siblingData) => siblingData?.destinationSource === 'manual',
      },
      fields: [
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'destinations',
          required: true,
        },
        {
          name: 'overrideTitle',
          type: 'text',
          label: 'Override Title',
          admin: { description: 'Replaces the destination name shown in the text panel' },
        },
        {
          name: 'overrideDescription',
          type: 'textarea',
          label: 'Override Description',
          admin: { description: 'Replaces the carousel subheading for this destination' },
        },
        {
          name: 'overrideButtonText',
          type: 'text',
          label: 'Override Button Text',
          admin: { description: 'Replaces the destination button text for this destination' },
        },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Carousel Headline',
      defaultValue: 'Преходи, пътешествия и експедиции в България и по света!',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Carousel Subheading',
      defaultValue: 'Пътувай с Sons of Mountains там, където комфортът среща приключението.',
    },
    {
      name: 'introSlideButtonText',
      type: 'text',
      label: 'Intro Slide Button Text',
      defaultValue: 'Разгледај',
    },
    {
      name: 'destinationButtonText',
      type: 'text',
      label: 'Destination Button Text',
      defaultValue: 'Разгледай',
    },
    {
      name: 'introSlideHeadline',
      type: 'text',
      label: 'Intro Slide Headline',
      admin: {
        description: 'Main headline for the first introductory slide',
      },
    },
    {
      name: 'introSlideSubheading',
      type: 'text',
      label: 'Intro Slide Subheading',
      admin: {
        description: 'Subheading for the first introductory slide',
      },
    },
    {
      name: 'introSlideBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Intro Slide Background Image',
      admin: {
        description: 'Background image for the intro slide',
      },
    },
    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateCarouselTag, revalidateGlobal('/')],
  },
}
