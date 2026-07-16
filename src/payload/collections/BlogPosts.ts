import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { description: 'Minutes' },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea', label: 'Мета описание на страницата', admin: { description: 'Мета описание на страниците. OG изображението се брандира автоматично (снимка + бяло лого).' } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Ако е зададена, се използва за OG изображението с автоматично добавено бяло лого отгоре.' } },
        { name: 'keywords', type: 'text', admin: { description: 'Comma-separated keywords' } },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('blog-posts', '/blog')],
    afterDelete: [revalidateCollectionDelete('blog-posts', '/blog')],
  },
}
