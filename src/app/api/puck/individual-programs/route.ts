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

  const hero = get('IndividualProgramsHeroBlock')
  const offer = get('IndividualProgramsOfferBlock')
  const how = get('IndividualProgramsHowBlock')
  const why = get('IndividualProgramsWhyBlock')
  const questionnaire = get('IndividualProgramsQuestionnaireBlock')

  const updateData: Record<string, unknown> = {
    puckData,
    ...(hero.heroHeading !== undefined && { heroHeading: hero.heroHeading }),
    ...(hero.heroSubtext !== undefined && { heroSubtext: hero.heroSubtext }),
    ...(hero.heroCtaLabel !== undefined && { heroCtaLabel: hero.heroCtaLabel }),
    ...(hero.heroCtaUrl !== undefined && { heroCtaUrl: hero.heroCtaUrl }),
    ...(offer.offerHeading !== undefined && { offerHeading: offer.offerHeading }),
    ...(offer.offerSubtext !== undefined && { offerSubtext: offer.offerSubtext }),
    ...(offer.offerItems !== undefined && { offerItems: offer.offerItems }),
    ...(how.howHeading !== undefined && { howHeading: how.howHeading }),
    ...(how.howSubtext !== undefined && { howSubtext: how.howSubtext }),
    ...(how.howSteps !== undefined && { howSteps: how.howSteps }),
    ...(why.whyHeading !== undefined && { whyHeading: why.whyHeading }),
    ...(why.whySubtext !== undefined && { whySubtext: why.whySubtext }),
    ...(why.whyPoints !== undefined && { whyPoints: why.whyPoints }),
    ...(questionnaire.questionnaireHeading !== undefined && { questionnaireHeading: questionnaire.questionnaireHeading }),
    ...(questionnaire.questionnaireSubtext !== undefined && { questionnaireSubtext: questionnaire.questionnaireSubtext }),
    ...(questionnaire.questions !== undefined && { questions: questionnaire.questions }),
    ...(questionnaire.formNamePlaceholder !== undefined && { formNamePlaceholder: questionnaire.formNamePlaceholder }),
    ...(questionnaire.formEmailPlaceholder !== undefined && { formEmailPlaceholder: questionnaire.formEmailPlaceholder }),
    ...(questionnaire.formPhonePlaceholder !== undefined && { formPhonePlaceholder: questionnaire.formPhonePlaceholder }),
    ...(questionnaire.formSubmitLabel !== undefined && { formSubmitLabel: questionnaire.formSubmitLabel }),
    ...(questionnaire.formSubmitLoadingLabel !== undefined && { formSubmitLoadingLabel: questionnaire.formSubmitLoadingLabel }),
    ...(questionnaire.formSuccessHeading !== undefined && { formSuccessHeading: questionnaire.formSuccessHeading }),
    ...(questionnaire.formSuccessSubtext !== undefined && { formSuccessSubtext: questionnaire.formSuccessSubtext }),
    ...(questionnaire.formErrorText !== undefined && { formErrorText: questionnaire.formErrorText }),
    ...(questionnaire.formRateLimitedText !== undefined && { formRateLimitedText: questionnaire.formRateLimitedText }),
    ...(questionnaire.formNameMinError !== undefined && { formNameMinError: questionnaire.formNameMinError }),
    ...(questionnaire.formEmailInvalidError !== undefined && { formEmailInvalidError: questionnaire.formEmailInvalidError }),
  }

  await payload.updateGlobal({
    slug: 'individual-programs-page',
    data: updateData,
    overrideAccess: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(revalidateTag as any)('individual-programs-page', 'max')

  return Response.json({ ok: true })
}
