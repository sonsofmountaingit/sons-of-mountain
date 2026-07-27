import type { CollectionConfig } from 'payload'

export const TravelStats: CollectionConfig = {
  slug: 'travel-stats',
  labels: {
    singular: 'Статистика',
    plural: 'Статистика',
  },
  admin: {
    group: 'Пътувания',
    components: {
      views: {
        list: {
          Component: '@/components/admin/TravelStatsView#TravelStatsView',
        },
      },
    },
  },
  access: {
    read: ({ req }) => req.user?.collection === 'users' && (req.user as { role?: string }).role === 'admin',
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
    },
  ],
}
