import type { BasePayload } from 'payload'

export async function upsertSubscriber(
  payload: BasePayload,
  data: { email: string; firstName?: string; lastName?: string; source?: string },
): Promise<void> {
  if (!data.email) return
  try {
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: data.email } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      const doc = existing.docs[0] as any
      if (doc.status !== 'unsubscribed' && doc.status !== 'bounced') {
        await payload.update({
          collection: 'subscribers',
          id: doc.id,
          data: { firstName: data.firstName ?? doc.firstName, lastName: data.lastName ?? doc.lastName },
        })
      }
      return
    }
    await payload.create({
      collection: 'subscribers',
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        source: (data.source as any) ?? 'manual',
        status: 'active',
        subscribedAt: new Date().toISOString(),
      } as any,
    })
  } catch {}
}
