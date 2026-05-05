import type { Block } from 'payload'

export const ImageGalleryBlock: Block = {
  slug: 'image-gallery',
  labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      options: ['grid', 'carousel', 'masonry', 'strip'],
      defaultValue: 'carousel',
    },
  ],
}
