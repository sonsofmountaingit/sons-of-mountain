import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['registration', 'registrationForm', 'submittedAt'],
    group: 'Регистрации',
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'registration',
      type: 'relationship',
      relationTo: 'registrations',
      required: true,
    },
    {
      name: 'registrationForm',
      type: 'relationship',
      relationTo: 'registration-forms',
      required: true,
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: { description: 'Подадени отговори, keyed по fieldKey' },
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true },
    },
  ],
}
