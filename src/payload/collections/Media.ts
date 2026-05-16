import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'thumbnail_avif', width: 400, height: 300, position: 'centre', formatOptions: { format: 'avif', options: { quality: 65 } } },
      { name: 'card', width: 828, height: 1104, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'card_avif', width: 828, height: 1104, position: 'centre', formatOptions: { format: 'avif', options: { quality: 65 } } },
      { name: 'hero', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 'hero_avif', width: 1920, height: 1080, position: 'centre', formatOptions: { format: 'avif', options: { quality: 68 } } },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: { quality: 82, effort: 6 },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
