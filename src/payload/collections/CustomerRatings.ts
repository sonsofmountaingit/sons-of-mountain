import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

const enforceUnique: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data
  const where: Record<string, unknown> = { customer: { equals: data.customer } }
  if (data.destination) where.destination = { equals: data.destination }
  else if (data.trip) where.trip = { equals: data.trip }

  const existing = await req.payload.find({
    collection: 'customer-ratings',
    where: where as any,
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    throw new Error('Вече си оценил тази дестинация/пътуване.')
  }
  return data
}

export const CustomerRatings: CollectionConfig = {
  slug: 'customer-ratings',
  admin: {
    useAsTitle: 'id',
    group: 'Клиенти',
    defaultColumns: ['customer', 'destination', 'trip', 'rating', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).collection === 'users') return true
      return { customer: { equals: (req.user as any).id } }
    },
    delete: ({ req }) => (req.user as any)?.collection === 'users',
  },
  hooks: {
    beforeChange: [enforceUnique],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { position: 'sidebar' },
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      admin: { position: 'sidebar' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: { position: 'sidebar' },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: { position: 'sidebar' },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
    },
    {
      name: 'review',
      type: 'textarea',
    },
  ],
}
