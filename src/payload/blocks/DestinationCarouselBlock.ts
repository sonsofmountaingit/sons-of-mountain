import type { Block } from 'payload'

export const DestinationCarouselBlock: Block = {
  slug: 'destination-carousel',
  labels: { singular: 'Destination Carousel', plural: 'Destination Carousels' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'destinations',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
