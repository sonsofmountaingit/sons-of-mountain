import type { Field } from 'payload'

export const bookingDeadlineField: Field = {
  name: 'bookingDeadline',
  type: 'date',
  label: 'Краен срок за записване',
  admin: {
    position: 'sidebar',
    description: 'След тази дата бутоните за резервация/записване се деактивират. Оставете празно, за да няма краен срок.',
    date: { pickerAppearance: 'dayAndTime' },
  },
}
