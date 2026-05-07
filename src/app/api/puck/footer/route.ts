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

  const subscribe = get('FooterSubscribeBlock')
  const follow = get('FooterFollowBlock')
  const travel = get('FooterTravelBlock')
  const nav = get('FooterNavBlock')
  const bottom = get('FooterBottomBlock')

  const updateData: Record<string, unknown> = {
    puckData,
    ...(subscribe.subscribeHeading !== undefined && { subscribeHeading: subscribe.subscribeHeading }),
    ...(subscribe.subscribeSubtext !== undefined && { subscribeSubtext: subscribe.subscribeSubtext }),
    ...(subscribe.submitLabel !== undefined && { submitLabel: subscribe.submitLabel }),
    ...(subscribe.firstNamePlaceholder !== undefined && { firstNamePlaceholder: subscribe.firstNamePlaceholder }),
    ...(subscribe.lastNamePlaceholder !== undefined && { lastNamePlaceholder: subscribe.lastNamePlaceholder }),
    ...(subscribe.emailPlaceholder !== undefined && { emailPlaceholder: subscribe.emailPlaceholder }),
    ...(subscribe.consentText !== undefined && { consentText: subscribe.consentText }),
    ...(subscribe.consentLinkText !== undefined && { consentLinkText: subscribe.consentLinkText }),
    ...(subscribe.privacyUrl !== undefined && { privacyUrl: subscribe.privacyUrl }),
    ...(follow.followHeading !== undefined && { followHeading: follow.followHeading }),
    ...(follow.followSubtext !== undefined && { followSubtext: follow.followSubtext }),
    ...(follow.facebookUrl !== undefined && { facebookUrl: follow.facebookUrl }),
    ...(follow.facebookFollowers !== undefined && { facebookFollowers: follow.facebookFollowers }),
    ...(follow.instagramUrl !== undefined && { instagramUrl: follow.instagramUrl }),
    ...(follow.instagramFollowers !== undefined && { instagramFollowers: follow.instagramFollowers }),
    ...(travel.travelSectionHeading !== undefined && { travelSectionHeading: travel.travelSectionHeading }),
    ...(nav.navSectionHeading !== undefined && { navSectionHeading: nav.navSectionHeading }),
    ...(bottom.copyright !== undefined && { copyright: bottom.copyright }),
    ...(bottom.licenseText !== undefined && { licenseText: bottom.licenseText }),
    ...(bottom.insuranceText !== undefined && { insuranceText: bottom.insuranceText }),
    ...(bottom.termsLabel !== undefined && { termsLabel: bottom.termsLabel }),
    ...(bottom.termsUrl !== undefined && { termsUrl: bottom.termsUrl }),
    ...(bottom.privacyLabel !== undefined && { privacyLabel: bottom.privacyLabel }),
    ...(bottom.privacyUrl !== undefined && { privacyUrl: bottom.privacyUrl }),
    ...(bottom.creditPrefix !== undefined && { creditPrefix: bottom.creditPrefix }),
    ...(bottom.creditName !== undefined && { creditName: bottom.creditName }),
    ...(bottom.creditUrl !== undefined && { creditUrl: bottom.creditUrl }),
  }

  await payload.updateGlobal({
    slug: 'footer',
    data: updateData,
    overrideAccess: true,
  })

  revalidateTag('footer', 'default')

  return Response.json({ ok: true })
}
