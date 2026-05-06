import type { CollectionConfig } from 'payload'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateFooterTrips = ({ doc }: { doc: unknown }) => {
  try { after(() => { revalidateTag('trips') }) } catch { /* noop */ }
  return doc
}
const revalidateFooterTripsDelete = () => {
  try { after(() => { revalidateTag('trips') }) } catch { /* noop */ }
}

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'startDate', 'status', 'spotsAvailable'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'spotsTotal',
      type: 'number',
      required: true,
      defaultValue: 12,
    },
    {
      name: 'spotsAvailable',
      type: 'number',
      required: true,
      defaultValue: 12,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      options: ['BGN', 'EUR', 'USD'],
      defaultValue: 'EUR',
      required: true,
    },
    {
      name: 'depositAmount',
      type: 'number',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: ['Singles Only', 'Family', 'Adventure', 'Cultural', 'Beach', 'Yacht'],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Sold Out', value: 'soldOut' },
        { label: 'Draft', value: 'draft' },
      ],
      defaultValue: 'active',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('trips', '/destinations'), revalidateFooterTrips],
    afterDelete: [revalidateCollectionDelete('trips', '/destinations'), revalidateFooterTripsDelete],
  },
}
