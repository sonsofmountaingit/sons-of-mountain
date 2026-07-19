import type { CollectionConfig } from 'payload'

const FILTER_TYPES = [
  { label: 'All active subscribers', value: 'all' },
  { label: 'Tag', value: 'tag' },
  { label: 'Destination interest', value: 'destination_interest' },
  { label: 'Has booked a specific trip/program', value: 'booking_history' },
  { label: 'Has never booked', value: 'no_booking' },
  { label: 'Cold lead (subscribed N+ days, no booking)', value: 'cold_lead' },
  { label: 'Active Adventure Pass (monthly)', value: 'subscription_monthly' },
  { label: 'Active Adventure Pass (annual)', value: 'subscription_annual' },
  { label: 'Any active Adventure Pass', value: 'subscription_any' },
  { label: 'Upcoming trip participant (in next N days)', value: 'upcoming_trip' },
  { label: 'Past traveller (completed trip)', value: 'past_traveller' },
  { label: 'Booked Bulgaria trips', value: 'trip_region_bulgaria' },
  { label: 'Booked abroad trips', value: 'trip_region_abroad' },
  { label: 'Language preference', value: 'language' },
  { label: 'High-value customer (spent > N EUR)', value: 'high_value' },
  { label: 'Has active discount code', value: 'has_discount' },
  { label: 'On waitlist (any item)', value: 'on_waitlist' },
  { label: 'Gift voucher buyer', value: 'voucher_buyer' },
  { label: 'Gift voucher recipient', value: 'voucher_recipient' },
  { label: 'Has given a rating', value: 'has_rated' },
  { label: 'Past traveller — never rated', value: 'no_rating' },
  { label: 'Source: footer signup', value: 'source_footer' },
  { label: 'Source: booking auto-enroll', value: 'source_booking' },
  { label: 'Booked yoga programs', value: 'program_type_yoga' },
  { label: 'Booked ski programs', value: 'program_type_ski' },
  { label: 'Booked photography programs', value: 'program_type_photography' },
  { label: 'Booked hiking programs', value: 'program_type_hiking' },
  { label: 'Interested in specific destination', value: 'destination_specific' },
  { label: 'Registered during early bird window', value: 'early_bird_buyer' },
]

export const Segments: CollectionConfig = {
  slug: 'segments',
  admin: { group: 'Email Marketing', useAsTitle: 'name' },
  hooks: {
    afterChange: [
      async ({ doc, req, context }) => {
        // Guard against re-entrant afterChange: the update below would otherwise re-trigger
        // this same hook and recurse indefinitely.
        if (context?.skipRecalculateCount) return doc
        const { resolveSegment } = await import('@/lib/segments')
        const subscribers = await resolveSegment(doc.id, req.payload)
        await req.payload.update({
          collection: 'segments',
          id: doc.id,
          data: { subscriberCount: subscribers.length, previewCount: subscribers.length },
          context: { skipRecalculateCount: true },
        })
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text', admin: { description: 'Internal note on who this segment targets.' } },
    {
      name: 'filterRules',
      type: 'array',
      fields: [
        { name: 'type', type: 'select', options: FILTER_TYPES, required: true },
        { name: 'value', type: 'text' },
        {
          name: 'operator',
          type: 'select',
          defaultValue: 'include',
          options: [
            { label: 'Include — must match', value: 'include' },
            { label: 'Exclude — must NOT match', value: 'exclude' },
          ],
        },
      ],
    },
    { name: 'subscriberCount', type: 'number', admin: { readOnly: true } },
    { name: 'previewCount', type: 'number', admin: { readOnly: true, description: 'Estimated recipient count. Recalculated on save.' } },
  ],
}
