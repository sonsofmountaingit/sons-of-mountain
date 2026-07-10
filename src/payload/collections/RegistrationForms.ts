import type { CollectionConfig } from 'payload'

export const RegistrationForms: CollectionConfig = {
  slug: 'registration-forms',
  labels: {
    singular: 'Формуляр за безплатен трансфер',
    plural: 'Формуляри за безплатен трансфер',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'trip', 'sendAfterDays', 'sendBeforeDaysMin'],
    group: 'Регистрации',
    description: 'Формуляр за записване, изпращан по имейл на всички записали се за връх/пътуване, след като се въведе датата на връха (полето "peak").',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Име на формуляра',
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      label: 'Връх',
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'trips',
      label: 'Пътуване',
    },
    {
      name: 'emailSubject',
      type: 'text',
      label: 'Тема на имейла',
      defaultValue: 'Формуляр за записване',
      required: true,
    },
    {
      name: 'emailIntro',
      type: 'textarea',
      label: 'Въведение в имейла',
      defaultValue: 'Моля, попълни формуляра за записване по-долу.',
    },
    {
      name: 'sendAfterDays',
      type: 'number',
      label: 'Изчакване след записване (дни)',
      defaultValue: 5,
      required: true,
      admin: { description: 'Формулярът се изпраща най-рано този брой дни след записването.' },
    },
    {
      name: 'sendBeforeDaysMin',
      type: 'number',
      label: 'Минимум дни преди старт',
      defaultValue: 30,
      required: true,
      admin: { description: 'Формулярът не се изпраща по-късно от този брой дни преди датата на тръгване.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Активен',
      defaultValue: true,
    },
    {
      name: 'fields',
      type: 'array',
      label: 'Полета на формуляра',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Етикет',
        },
        {
          name: 'fieldKey',
          type: 'text',
          required: true,
          label: 'Ключ (латиница, без интервали)',
          admin: { description: 'Например: emergency_contact' },
        },
        {
          name: 'fieldType',
          type: 'select',
          label: 'Тип на полето',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Кратък текст', value: 'text' },
            { label: 'Дълъг текст', value: 'textarea' },
            { label: 'Число', value: 'number' },
            { label: 'Дата', value: 'date' },
            { label: 'Избор (select)', value: 'select' },
            { label: 'Отметка (checkbox)', value: 'checkbox' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          label: 'Опции (за select)',
          admin: { condition: (_, siblingData) => siblingData?.fieldType === 'select' },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Задължително',
          defaultValue: false,
        },
        {
          name: 'helpText',
          type: 'text',
          label: 'Помощен текст',
        },
      ],
    },
  ],
}
