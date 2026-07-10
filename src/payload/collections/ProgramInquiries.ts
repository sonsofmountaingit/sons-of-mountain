import type { CollectionConfig } from 'payload'

export const ProgramInquiries: CollectionConfig = {
  slug: 'program-inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'emailSent', 'createdAt'],
    group: 'Пътувания',
    description: 'Запитвания от въпросника на страницата "Индивидуални програми"',
  },
  access: {
    // Creation only happens server-side via /api/individual-program-inquiry using overrideAccess,
    // which enforces rate-limiting, validation, and length caps before writing here.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'answers',
      type: 'array',
      label: 'Отговори',
      admin: { readOnly: true },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'emailSent', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', readOnly: true } },
    { name: 'ip', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
  timestamps: true,
}
