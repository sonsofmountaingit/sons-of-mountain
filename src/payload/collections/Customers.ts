import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { APIError } from 'payload'

const linkGuestRecordsToCustomer: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const email = doc.email as string | undefined
  if (!email) return doc

  const collections = [
    { slug: 'orders', emailField: 'email' },
    { slug: 'registrations', emailField: 'email' },
    { slug: 'gift-vouchers', emailField: 'senderEmail' },
  ] as const

  for (const { slug, emailField } of collections) {
    try {
      await req.payload.update({
        collection: slug,
        where: {
          and: [
            { [emailField]: { equals: email } },
            { customer: { exists: false } },
          ],
        },
        data: { customer: doc.id },
        req,
      })
    } catch {
      // best-effort linkage; do not block customer creation
    }
  }

  return doc
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: {
    tokenExpiration: 7200,
    verify: false,
    forgotPassword: {
      generateEmailSubject: () => 'Смяна на парола — Sons of Mountains',
      generateEmailHTML: ({ token } = {}) => {
        const baseURL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '')
        const resetURL = `${baseURL}/reset-password?token=${encodeURIComponent(token ?? '')}`
        return `<p>Получихме заявка за смяна на паролата ти в Sons of Mountains.</p><p><a href="${resetURL}">Задай нова парола</a></p><p>Ако не си поискал/а тази промяна, можеш да игнорираш този имейл.</p>`
      },
    },
    cookies: {
      secure: false,
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'createdAt'],
    group: 'Клиенти',
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'customers') return { id: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection === 'customers') return { id: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.collection === 'users',
    admin: ({ req }) => req.user?.collection === 'users',
  },
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        if (user.status !== 'active') {
          throw new APIError('Този акаунт е блокиран или спрян.', 403, undefined, true)
        }
      },
    ],
    afterChange: [linkGuestRecordsToCustomer],
  },
  fields: [
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
      name: 'phone',
      type: 'text',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'address',
      type: 'textarea',
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
    {
      name: 'wishlist',
      type: 'array',
      fields: [
        {
          name: 'itemType',
          type: 'select',
          options: [
            { label: 'Пътуване', value: 'trip' },
            { label: 'Програма', value: 'program' },
            { label: 'Дестинация', value: 'destination' },
            { label: 'Продукт', value: 'product' },
          ],
          required: true,
        },
        {
          name: 'trip',
          type: 'relationship',
          relationTo: 'trips',
          admin: { condition: (_, s) => s?.itemType === 'trip' },
        },
        {
          name: 'program',
          type: 'relationship',
          relationTo: 'programs',
          admin: { condition: (_, s) => s?.itemType === 'program' },
        },
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'destinations',
          admin: { condition: (_, s) => s?.itemType === 'destination' },
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          admin: { condition: (_, s) => s?.itemType === 'product' },
        },
      ],
    },
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Current loyalty points balance (100 pts = €1 discount)', position: 'sidebar' },
    },
    {
      name: 'loyaltyTier',
      type: 'select',
      options: [
        { label: 'Bronze (0–499 pts)', value: 'bronze' },
        { label: 'Silver (500–1499 pts)', value: 'silver' },
        { label: 'Gold (1500–4999 pts)', value: 'gold' },
        { label: 'Platinum (5000+ pts)', value: 'platinum' },
      ],
      defaultValue: 'bronze',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe customer ID for saved payment methods' },
    },
    {
      name: 'defaultPaymentMethodId',
      type: 'text',
      admin: { readOnly: true, description: 'Stripe default payment method ID', position: 'sidebar' },
    },
    {
      name: 'displayCurrency',
      type: 'select',
      options: [{ label: 'EUR (€)', value: 'eur' }],
      defaultValue: 'eur',
      admin: { description: 'Preferred display currency (checkout always in EUR)', position: 'sidebar' },
    },
    {
      name: 'referralCode',
      type: 'relationship',
      relationTo: 'discount-codes',
      admin: { readOnly: true, description: 'This customer\'s unique referral code' },
    },
  ],
}
