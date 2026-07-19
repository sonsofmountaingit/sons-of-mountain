import type { BasePayload } from 'payload'

export type SegmentSubscriber = {
  email: string
  firstName?: string
  lastName?: string
  unsubscribeToken?: string
}

type FilterRule = { type: string; value?: string; operator?: 'include' | 'exclude' }

async function activeSubscribers(payload: BasePayload): Promise<SegmentSubscriber[]> {
  const res = await payload.find({ collection: 'subscribers', where: { status: { equals: 'active' } }, limit: 10000 })
  return res.docs.map((d: any) => ({ email: d.email, firstName: d.firstName, lastName: d.lastName, unsubscribeToken: d.unsubscribeToken }))
}

async function subscribersByEmails(payload: BasePayload, emails: string[]): Promise<SegmentSubscriber[]> {
  if (!emails.length) return []
  const res = await payload.find({
    collection: 'subscribers',
    where: { and: [{ status: { equals: 'active' } }, { email: { in: emails } }] },
    limit: 10000,
  })
  return res.docs.map((d: any) => ({ email: d.email, firstName: d.firstName, lastName: d.lastName, unsubscribeToken: d.unsubscribeToken }))
}

// registrationWhere is applied as-is to registrations (which has top-level trip/program fields).
// Orders only has trip/program nested under items[], so a matching orderWhere must be passed
// separately when the filter needs to apply to orders too; omit it to skip orders entirely.
async function customerEmailsWithPaidBooking(
  payload: BasePayload,
  registrationWhere: Record<string, unknown> = {},
  orderWhere?: Record<string, unknown>,
): Promise<string[]> {
  const regs = await payload.find({
    collection: 'registrations',
    where: { and: [{ status: { in: ['paid', 'confirmed'] } }, registrationWhere] } as any,
    limit: 10000,
    depth: 1,
  })
  const emails = new Set<string>()
  for (const r of regs.docs as any[]) if (r.email) emails.add(r.email)

  if (orderWhere !== undefined) {
    const orders = await payload.find({
      collection: 'orders',
      where: { and: [{ status: { equals: 'paid' } }, orderWhere] } as any,
      limit: 10000,
      depth: 1,
    })
    for (const o of orders.docs as any[]) if (o.email) emails.add(o.email)
  }

  return Array.from(emails)
}

async function resolveFilterEmails(payload: BasePayload, rule: FilterRule): Promise<string[] | 'all'> {
  const { type, value } = rule
  switch (type) {
    case 'all':
      return 'all'
    case 'tag': {
      const res = await payload.find({ collection: 'subscribers', where: { 'tags.tag': { equals: value } }, limit: 10000 })
      return (res.docs as any[]).map((d) => d.email)
    }
    case 'destination_interest': {
      const dest = await payload.find({ collection: 'destinations', where: { slug: { equals: value } }, limit: 1 })
      if (!dest.docs[0]) return []
      const res = await payload.find({ collection: 'subscribers', where: { destinationInterests: { equals: dest.docs[0].id } }, limit: 10000 })
      return (res.docs as any[]).map((d) => d.email)
    }
    case 'booking_history': {
      const trips = await payload.find({ collection: 'trips', where: { slug: { equals: value } }, limit: 1 })
      const progs = await payload.find({ collection: 'programs', where: { slug: { equals: value } }, limit: 1 })
      const id = trips.docs[0]?.id ?? progs.docs[0]?.id
      if (!id) return []
      const field = trips.docs[0] ? 'trip' : 'program'
      // Orders only nest trip/program under items[], not top-level, so this filter checks
      // registrations only. A trip/program bought via the cart flow (Orders) isn't matched here.
      return customerEmailsWithPaidBooking(payload, { [field]: { equals: id } })
    }
    case 'no_booking': {
      const booked = await customerEmailsWithPaidBooking(payload, {}, {})
      const all = await payload.find({ collection: 'subscribers', where: { status: { equals: 'active' } }, limit: 10000 })
      return (all.docs as any[]).map((d) => d.email).filter((e) => !booked.includes(e))
    }
    case 'cold_lead': {
      const days = Number(value) || 30
      const cutoff = new Date(Date.now() - days * 86400_000).toISOString()
      const booked = await customerEmailsWithPaidBooking(payload, {}, {})
      const res = await payload.find({
        collection: 'subscribers',
        where: { and: [{ status: { equals: 'active' } }, { subscribedAt: { less_than_equal: cutoff } }] },
        limit: 10000,
      })
      return (res.docs as any[]).map((d) => d.email).filter((e) => !booked.includes(e))
    }
    case 'subscription_monthly':
    case 'subscription_annual':
    case 'subscription_any': {
      const plan = type === 'subscription_monthly' ? 'monthly' : type === 'subscription_annual' ? 'annual' : undefined
      const res = await payload.find({
        collection: 'subscriptions',
        where: plan ? { and: [{ status: { equals: 'active' } }, { plan: { equals: plan } }] } : { status: { equals: 'active' } },
        limit: 10000,
        depth: 1,
      })
      return (res.docs as any[]).map((s) => s.customer?.email).filter(Boolean)
    }
    case 'upcoming_trip': {
      const days = Number(value) || 7
      const now = new Date().toISOString()
      const until = new Date(Date.now() + days * 86400_000).toISOString()
      const regs = await payload.find({
        collection: 'registrations',
        where: { and: [{ status: { in: ['paid', 'confirmed'] } }, { 'trip.startDate': { greater_than_equal: now } }, { 'trip.startDate': { less_than_equal: until } }] } as any,
        limit: 10000,
      })
      return (regs.docs as any[]).map((r) => r.email).filter(Boolean)
    }
    case 'past_traveller': {
      const now = new Date().toISOString()
      const regs = await payload.find({
        collection: 'registrations',
        where: { and: [{ status: { in: ['paid', 'confirmed'] } }, { 'trip.endDate': { less_than: now } }] } as any,
        limit: 10000,
      })
      return (regs.docs as any[]).map((r) => r.email).filter(Boolean)
    }
    case 'trip_region_bulgaria':
    case 'trip_region_abroad': {
      const section = type === 'trip_region_bulgaria' ? 'bulgaria' : 'abroad'
      const regs = await payload.find({
        collection: 'registrations',
        where: { and: [{ status: { in: ['paid', 'confirmed'] } }, { 'trip.navSection': { equals: section } }] } as any,
        limit: 10000,
      })
      return (regs.docs as any[]).map((r) => r.email).filter(Boolean)
    }
    case 'language': {
      const res = await payload.find({ collection: 'customers', where: { preferredLang: { equals: value } }, limit: 10000 })
      return (res.docs as any[]).map((c) => c.email)
    }
    case 'high_value': {
      const min = Number(value) || 500
      const orders = await payload.find({ collection: 'orders', where: { status: { equals: 'paid' } }, limit: 10000 })
      const regs = await payload.find({ collection: 'registrations', where: { status: { in: ['paid', 'confirmed'] } }, limit: 10000 })
      const totals = new Map<string, number>()
      for (const d of [...(orders.docs as any[]), ...(regs.docs as any[])]) {
        if (!d.email) continue
        totals.set(d.email, (totals.get(d.email) ?? 0) + (d.totalAmount ?? 0))
      }
      return Array.from(totals.entries()).filter(([, sum]) => sum > min).map(([email]) => email)
    }
    case 'has_discount': {
      const res = await payload.find({ collection: 'discount-codes', where: { isActive: { equals: true } }, limit: 10000, depth: 1 })
      return (res.docs as any[]).map((d) => d.referredBy?.email ?? d.usedByCustomers?.[0]?.customer?.email).filter(Boolean)
    }
    case 'on_waitlist': {
      const res = await payload.find({ collection: 'waitlist', where: { status: { equals: 'waiting' } }, limit: 10000 })
      return (res.docs as any[]).map((w) => w.email).filter(Boolean)
    }
    case 'voucher_buyer': {
      const res = await payload.find({ collection: 'gift-vouchers', where: { customer: { exists: true } }, limit: 10000, depth: 1 })
      return (res.docs as any[]).map((v) => v.customer?.email ?? v.senderEmail).filter(Boolean)
    }
    case 'voucher_recipient': {
      const res = await payload.find({ collection: 'gift-vouchers', where: { recipientEmail: { exists: true } }, limit: 10000 })
      return (res.docs as any[]).map((v) => v.recipientEmail).filter(Boolean)
    }
    case 'has_rated': {
      const res = await payload.find({ collection: 'customer-ratings', limit: 10000, depth: 1 })
      return (res.docs as any[]).map((r) => r.customer?.email).filter(Boolean)
    }
    case 'no_rating': {
      const traveller = await resolveFilterEmails(payload, { type: 'past_traveller' })
      const rated = await resolveFilterEmails(payload, { type: 'has_rated' })
      const travellerEmails = traveller === 'all' ? [] : traveller
      const ratedEmails = rated === 'all' ? [] : rated
      return travellerEmails.filter((e) => !ratedEmails.includes(e))
    }
    case 'source_footer': {
      const res = await payload.find({ collection: 'subscribers', where: { and: [{ status: { equals: 'active' } }, { source: { equals: 'footer_form' } }] }, limit: 10000 })
      return (res.docs as any[]).map((d) => d.email)
    }
    case 'source_booking': {
      const res = await payload.find({ collection: 'subscribers', where: { and: [{ status: { equals: 'active' } }, { source: { equals: 'booking' } }] }, limit: 10000 })
      return (res.docs as any[]).map((d) => d.email)
    }
    case 'program_type_yoga':
    case 'program_type_ski':
    case 'program_type_photography':
    case 'program_type_hiking': {
      const typeMap: Record<string, string> = { program_type_yoga: 'Yoga', program_type_ski: 'Ski', program_type_photography: 'Photography', program_type_hiking: 'Hiking' }
      const regs = await payload.find({
        collection: 'registrations',
        where: { and: [{ status: { in: ['paid', 'confirmed'] } }, { 'program.type': { equals: typeMap[type] } }] } as any,
        limit: 10000,
      })
      return (regs.docs as any[]).map((r) => r.email).filter(Boolean)
    }
    case 'destination_specific': {
      const dest = await payload.find({ collection: 'destinations', where: { slug: { equals: value } }, limit: 1 })
      if (!dest.docs[0]) return []
      const res = await payload.find({ collection: 'subscribers', where: { destinationInterests: { equals: dest.docs[0].id } }, limit: 10000 })
      return (res.docs as any[]).map((d) => d.email)
    }
    case 'early_bird_buyer': {
      // Registration.isEarlyBird is not persisted — it's derived at booking time from the
      // trip's earlyBirdUntil deadline. Approximate by comparing createdAt against the trip's
      // early-bird deadline for paid/confirmed registrations with a depth-populated trip.
      const regs = await payload.find({
        collection: 'registrations',
        where: { status: { in: ['paid', 'confirmed'] } },
        limit: 10000,
        depth: 1,
      })
      return (regs.docs as any[])
        .filter((r) => {
          const trip = r.trip
          if (!trip?.earlyBirdUntil || !r.email) return false
          return new Date(r.createdAt) <= new Date(trip.earlyBirdUntil)
        })
        .map((r) => r.email)
    }
    default:
      return []
  }
}

export async function resolveSegment(segmentId: string, payload: BasePayload): Promise<SegmentSubscriber[]> {
  const segment = await payload.findByID({ collection: 'segments', id: segmentId })
  const rules = ((segment as any).filterRules ?? []) as FilterRule[]
  if (!rules.length) return activeSubscribers(payload)

  const includeRules = rules.filter((r) => (r.operator ?? 'include') === 'include')
  const excludeRules = rules.filter((r) => r.operator === 'exclude')

  let includeEmails: string[] | 'all' = 'all'
  for (const rule of includeRules) {
    const resolved = await resolveFilterEmails(payload, rule)
    if (resolved === 'all') continue
    includeEmails = includeEmails === 'all' ? resolved : includeEmails.filter((e) => resolved.includes(e))
  }

  let excludeEmails: string[] = []
  for (const rule of excludeRules) {
    const resolved = await resolveFilterEmails(payload, rule)
    if (resolved !== 'all') excludeEmails = [...excludeEmails, ...resolved]
  }

  if (includeEmails === 'all') {
    const all = await activeSubscribers(payload)
    return all.filter((s) => !excludeEmails.includes(s.email))
  }

  const filtered = includeEmails.filter((e) => !excludeEmails.includes(e))
  return subscribersByEmails(payload, filtered)
}

export async function resolveAudience(
  segmentIds: string[],
  audienceType: 'subscribers' | 'customers',
  payload: BasePayload,
): Promise<SegmentSubscriber[]> {
  if (!segmentIds.length) {
    if (audienceType === 'customers') {
      // Customers has no email-verification field (auth.verify is disabled) — active status
      // is the only account-standing signal available.
      const res = await payload.find({ collection: 'customers', where: { status: { equals: 'active' } }, limit: 10000 })
      // Customers only has a single 'name' field, no firstName/lastName split.
      return (res.docs as any[]).map((c) => ({ email: c.email, firstName: c.name }))
    }
    return activeSubscribers(payload)
  }
  const all = await Promise.all(segmentIds.map((id) => resolveSegment(id, payload)))
  const seen = new Set<string>()
  const result: SegmentSubscriber[] = []
  for (const list of all) {
    for (const s of list) {
      if (!seen.has(s.email)) {
        seen.add(s.email)
        result.push(s)
      }
    }
  }
  return result
}
