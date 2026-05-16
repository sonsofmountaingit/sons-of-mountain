import { betterAuth } from 'better-auth'
import { kyselyAdapter } from '@better-auth/kysely-adapter'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'

async function sendEmail(to: string, subject: string, html: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  await resend.emails.send({ from, to, subject, html })
}

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString: process.env.DATABASE_URI }),
  }),
})

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET ?? 'fallback-secret-change-in-production',
  database: kyselyAdapter(db, { type: 'postgres' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      await sendEmail(
        user.email,
        'Нулиране на парола — Sons of Mountains',
        `<p>Здравей!</p><p>Кликни <a href="${url}">тук</a>, за да нулираш паролата си.</p>`,
      )
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(
        user.email,
        'Потвърди имейла си — Sons of Mountains',
        `<p>Здравей!</p><p>Кликни <a href="${url}">тук</a>, за да потвърдиш имейла си.</p><p>Ако не си се регистрирал, игнорирай това писмо.</p>`,
      )
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const { getPayload } = await import('payload')
          const payloadConfig = await import('@payload-config')
          const payload = await getPayload({ config: payloadConfig.default })

          const existing = await payload.find({
            collection: 'customers',
            where: { betterAuthId: { equals: user.id } },
            limit: 1,
          })
          if (existing.docs.length > 0) return

          await payload.create({
            collection: 'customers',
            data: {
              betterAuthId: user.id,
              email: user.email,
              name: user.name ?? '',
              emailVerified: user.emailVerified ?? false,
              status: 'active',
            },
          })
        },
      },
      update: {
        after: async (user) => {
          const { getPayload } = await import('payload')
          const payloadConfig = await import('@payload-config')
          const payload = await getPayload({ config: payloadConfig.default })

          const existing = await payload.find({
            collection: 'customers',
            where: { betterAuthId: { equals: user.id } },
            limit: 1,
          })
          if (!existing.docs[0]) return

          await payload.update({
            collection: 'customers',
            id: existing.docs[0].id as number,
            data: {
              emailVerified: user.emailVerified ?? false,
              name: user.name ?? (existing.docs[0].name as string) ?? '',
            },
          })
        },
      },
    },
  },
})
