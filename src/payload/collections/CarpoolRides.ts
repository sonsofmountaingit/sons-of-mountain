import type { CollectionConfig } from 'payload'

export const CarpoolRides: CollectionConfig = {
  slug: 'carpool-rides',
  admin: {
    useAsTitle: 'departureFrom',
    defaultColumns: ['departureFrom', 'vehicleType', 'seatsAvailable', 'destination', 'trip', 'program', 'status', 'createdAt'],
    group: 'Споделено Пътуване',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Отворено', value: 'open' },
        { label: 'Запълнено', value: 'full' },
        { label: 'Затворено', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Създадено от администратор', value: 'admin' },
        { label: 'От форма за записване', value: 'registration' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основна информация',
          fields: [
            {
              name: 'vehicleType',
              type: 'text',
              required: true,
              label: 'Тип превозно средство',
              admin: { placeholder: 'напр. SUV, седан, бус...' },
            },
            {
              name: 'seatsAvailable',
              type: 'number',
              required: true,
              label: 'Свободни места',
              min: 1,
              max: 8,
            },
            {
              name: 'departureFrom',
              type: 'text',
              required: true,
              label: 'Тръгване от',
              admin: { placeholder: 'напр. София, кв. Лозенец...' },
            },
            {
              name: 'departureTime',
              type: 'date',
              label: 'Час/дата на тръгване',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Бележки',
            },
          ],
        },
        {
          label: 'Свързано пътуване',
          fields: [
            {
              name: 'destination',
              type: 'relationship',
              relationTo: 'destinations',
              label: 'Дестинация',
            },
            {
              name: 'trip',
              type: 'relationship',
              relationTo: 'trips',
              label: 'Трип',
            },
            {
              name: 'program',
              type: 'relationship',
              relationTo: 'programs',
              label: 'Програма',
            },
          ],
        },
        {
          label: 'Организатор',
          fields: [
            {
              name: 'organizerRegistration',
              type: 'relationship',
              relationTo: 'registrations',
              label: 'Регистрация на организатора',
              admin: { readOnly: true, description: 'Попълва се автоматично от форма за записване' },
            },
            {
              name: 'organizerName',
              type: 'text',
              label: 'Име на организатора',
            },
            {
              name: 'organizerEmail',
              type: 'email',
              label: 'Имейл на организатора',
            },
            {
              name: 'organizerPhone',
              type: 'text',
              label: 'Телефон на организатора',
            },
          ],
        },
        {
          label: 'Пътници',
          fields: [
            {
              name: 'passengers',
              type: 'array',
              label: 'Записани пътници',
              admin: { readOnly: true, description: 'Попълва се автоматично при записване' },
              fields: [
                {
                  name: 'registration',
                  type: 'relationship',
                  relationTo: 'registrations',
                  label: 'Регистрация',
                },
                {
                  name: 'name',
                  type: 'text',
                  label: 'Име',
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Имейл',
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Телефон',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
