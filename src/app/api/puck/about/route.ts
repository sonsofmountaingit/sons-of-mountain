import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { verifyPayloadJWT } from '@/lib/payload-auth'

export async function PATCH(request: Request) {
  if (!(await verifyPayloadJWT())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = await getPayload({ config })

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
    ...(hero.heroImagePositionX !== undefined && { heroImagePositionX: hero.heroImagePositionX }),
    ...(hero.heroImagePositionY !== undefined && { heroImagePositionY: hero.heroImagePositionY }),
    ...(adventure.adventureHeading !== undefined && { adventureHeading: adventure.adventureHeading }),
    ...(adventure.adventureSubtext !== undefined && { adventureSubtext: adventure.adventureSubtext }),
    ...(adventure.adventureActivities !== undefined && { adventureActivities: adventure.adventureActivities }),
    ...(adventure.adventureQuote !== undefined && { adventureQuote: adventure.adventureQuote }),
    ...(adventure.adventureQuoteBody !== undefined && { adventureQuoteBody: adventure.adventureQuoteBody }),
    ...(who.whoHeading !== undefined && { whoHeading: who.whoHeading }),
    ...(who.whoDescription !== undefined && { whoDescription: who.whoDescription }),
    ...(who.whoImage1Caption !== undefined && { whoImage1Caption: who.whoImage1Caption }),
    ...(who.whoImage1Instagram !== undefined && { whoImage1Instagram: who.whoImage1Instagram }),
    ...(who.whoImage2Caption !== undefined && { whoImage2Caption: who.whoImage2Caption }),
    ...(who.whoImage2Instagram !== undefined && { whoImage2Instagram: who.whoImage2Instagram }),
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
  ;(revalidateTag as any)('about', 'max')

  return Response.json({ ok: true })
}
