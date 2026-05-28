import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'

export async function PATCH(request: Request) {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders as unknown as Headers })
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { puckData?: any }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const puckData = body.puckData
  const content: any[] = puckData?.content ?? []
  const get = (type: string) => content.find((b: any) => b.type === type)?.props ?? {}

  const hero = get('AboutHeroBlock')
  const adventure = get('AboutAdventureBlock')
  const who = get('AboutWhoWeAreBlock')
  const partners = get('AboutPartnersBlock')

  const updateData: Record<string, unknown> = {
    puckData,
    ...(hero.heroHeading !== undefined && { heroHeading: hero.heroHeading }),
    ...(hero.heroSubtext !== undefined && { heroSubtext: hero.heroSubtext }),
    ...(hero.heroCtaLabel !== undefined && { heroCtaLabel: hero.heroCtaLabel }),
    ...(hero.heroCtaUrl !== undefined && { heroCtaUrl: hero.heroCtaUrl }),
    ...(hero.heroStatNumber !== undefined && { heroStatNumber: hero.heroStatNumber }),
    ...(hero.heroStatLabel !== undefined && { heroStatLabel: hero.heroStatLabel }),
    ...(adventure.adventureHeading !== undefined && { adventureHeading: adventure.adventureHeading }),
    ...(adventure.adventureSubtext !== undefined && { adventureSubtext: adventure.adventureSubtext }),
    ...(adventure.adventureActivities !== undefined && { adventureActivities: adventure.adventureActivities }),
    ...(adventure.adventureQuote !== undefined && { adventureQuote: adventure.adventureQuote }),
    ...(adventure.adventureQuoteBody !== undefined && { adventureQuoteBody: adventure.adventureQuoteBody }),
    ...(who.whoHeading !== undefined && { whoHeading: who.whoHeading }),
    ...(who.whoDescription !== undefined && { whoDescription: who.whoDescription }),
    ...(partners.partnersHeading !== undefined && { partnersHeading: partners.partnersHeading }),
    ...(partners.partnersSubtext !== undefined && { partnersSubtext: partners.partnersSubtext }),
    ...(partners.partnersCtaLabel !== undefined && { partnersCtaLabel: partners.partnersCtaLabel }),
    ...(partners.partnersCtaUrl !== undefined && { partnersCtaUrl: partners.partnersCtaUrl }),
  }

  await payload.updateGlobal({
    slug: 'about',
    data: updateData,
    overrideAccess: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(revalidateTag as any)('about')

  return Response.json({ ok: true })
}
