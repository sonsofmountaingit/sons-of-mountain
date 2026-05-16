import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'createdAt'],
    group: 'Клиенти',
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        if (doc.status !== previousDoc?.status && doc.status !== 'active' && doc.betterAuthId) {
          try {
            const { auth } = await import('@/lib/auth')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (auth.api.revokeSessions as any)({ body: { userId: doc.betterAuthId } })
          } catch {
            // session revoke best-effort
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'betterAuthId',
      type: 'text',
      unique: true,
      admin: { readOnly: true, description: 'Better Auth user ID' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Активен', value: 'active' },
        { label: 'Блокиран', value: 'blocked' },
        { label: 'Спрян', value: 'suspended' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'blockedReason',
      type: 'textarea',
      admin: {
        condition: (data) => data.status !== 'active',
        description: 'Причина за блокиране (видима само за администратори)',
      },
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true },
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'preferredLang',
      type: 'select',
      options: [
        { label: 'Български', value: 'BG' },
        { label: 'English', value: 'EN' },
        { label: 'Deutsch', value: 'DE' },
        { label: 'Русский', value: 'RU' },
      ],
      defaultValue: 'BG',
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Вътрешни бележки (видими само за администратори)' },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
      admin: { description: 'Напр. VIP, повторен клиент' },
    },
    {
      name: 'registrations',
      type: 'join',
      collection: 'registrations',
      on: 'customer',
      admin: { description: 'Регистрации за пътувания' },
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: { description: 'Поръчки от магазина' },
    },
    {
      name: 'vouchers',
      type: 'join',
      collection: 'gift-vouchers',
      on: 'customer',
      admin: { description: 'Закупени ваучери' },
    },
    {
      name: 'customerMedia',
      type: 'join',
      collection: 'customer-media',
      on: 'customer',
      admin: { description: 'Медия от клиента (снимки и видео)' },
    },
    {
      name: 'customerRatings',
      type: 'join',
      collection: 'customer-ratings',
      on: 'customer',
      admin: { description: 'Оценки на дестинации и пътувания' },
    },
  ],
}
