import { betterAuth } from 'better-auth'
import pg from 'pg'

const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'

async function sendEmail(to: string, subject: string, html: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  await resend.emails.send({ from, to, subject, html })
}

// Better Auth's own Postgres pool, separate from Payload's. Pass the pg.Pool directly (the
// documented adapter form) rather than hand-wrapping Kysely — the hand-wrapped adapter left a
// connection in a state that stalled the very next Payload query in the same request (checkout
// hung right after getSession, before Payload issued any SQL). Bound it small with fast-fail
// acquisition so it can never monopolise the server's connection slots.
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URI,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
})

const primaryOrigin = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const primaryHost = new URL(primaryOrigin).host
const wwwVariant = primaryHost.startsWith('www.')
  ? `${new URL(primaryOrigin).protocol}//${primaryHost.slice(4)}`
  : `${new URL(primaryOrigin).protocol}//www.${primaryHost}`

export const auth = betterAuth({
  baseURL: primaryOrigin,
  trustedOrigins: [primaryOrigin, wwwVariant, 'http://localhost:3000'],
  secret: process.env.BETTER_AUTH_SECRET ?? 'fallback-secret-change-in-production',
  database: db,
  // getSession is called inside server routes (e.g. the checkout API) alongside Payload DB
  // operations. By default every getSession hits the DB — and refreshes the session with a
  // WRITE when updateAge is reached — which, competing with Payload's pool inside one request,
  // stalled checkout indefinitely. Cookie caching serves the session from a signed cookie so
  // getSession is a pure read; disabling refresh removes the mid-request write entirely.
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    disableSessionRefresh: true,
  },
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
