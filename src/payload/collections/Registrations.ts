import type { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'trip', 'destination', 'status', 'totalAmount', 'createdAt'],
    group: 'Регистрации',
  },
  fields: [
    {
      name: 'betterAuthUserId',
      type: 'text',
      admin: { readOnly: true, description: 'Better Auth user ID (null = гост)' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: { readOnly: true, description: 'Клиент (ако е регистриран)' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Чакащ', value: 'pending' },
        { label: 'Потвърден', value: 'confirmed' },
        { label: 'Платен', value: 'paid' },
        { label: 'Отказан', value: 'cancelled' },
        { label: 'Върнат', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'participantCount',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'dietaryNotes',
      type: 'textarea',
    },
    {
      name: 'questions',
      type: 'textarea',
    },
    {
      name: 'agreedToTerms',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'totalAmount',
      type: 'number',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'EUR',
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
