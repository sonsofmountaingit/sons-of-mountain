import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'
import { IndividualProgramsHeroBlock } from '@/components/blocks/individual-programs/IndividualProgramsHeroBlock'
import { IndividualProgramsOfferBlock } from '@/components/blocks/individual-programs/IndividualProgramsOfferBlock'
import { IndividualProgramsHowBlock } from '@/components/blocks/individual-programs/IndividualProgramsHowBlock'
import { IndividualProgramsWhyBlock } from '@/components/blocks/individual-programs/IndividualProgramsWhyBlock'
import { IndividualProgramsQuestionnaireBlock } from '@/components/blocks/individual-programs/IndividualProgramsQuestionnaireBlock'
import { IndividualProgramsEditButton } from './IndividualProgramsEditButton'

const getIndividualProgramsData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'individual-programs-page', depth: 2, overrideAccess: true })
    } catch {
      return null
    }
  },
  ['individual-programs-page-global'],
  { tags: ['individual-programs-page'], revalidate: false },
)

export async function IndividualProgramsPage() {
  const d = (await getIndividualProgramsData()) as any

  const heroImageUrl = mediaUrl(typeof d?.heroImage === 'object' ? d?.heroImage?.url : null) ?? undefined
  const whyImageUrl = mediaUrl(typeof d?.whyImage === 'object' ? d?.whyImage?.url : null) ?? undefined

  return (
    <>
      <IndividualProgramsHeroBlock
        heroHeading={d?.heroHeading}
        heroSubtext={d?.heroSubtext}
        heroCtaLabel={d?.heroCtaLabel}
        heroCtaUrl={d?.heroCtaUrl}
        heroImageUrl={heroImageUrl}
      />
      <IndividualProgramsOfferBlock
        offerHeading={d?.offerHeading}
        offerSubtext={d?.offerSubtext}
        offerItems={d?.offerItems ?? []}
      />
      <IndividualProgramsHowBlock
        howHeading={d?.howHeading}
        howSubtext={d?.howSubtext}
        howSteps={d?.howSteps ?? []}
      />
      <IndividualProgramsWhyBlock
        whyHeading={d?.whyHeading}
        whySubtext={d?.whySubtext}
        whyImageUrl={whyImageUrl}
        whyPoints={d?.whyPoints ?? []}
      />
      <IndividualProgramsQuestionnaireBlock
        questionnaireHeading={d?.questionnaireHeading}
        questionnaireSubtext={d?.questionnaireSubtext}
        questions={d?.questions ?? []}
        formNamePlaceholder={d?.formNamePlaceholder}
        formEmailPlaceholder={d?.formEmailPlaceholder}
        formPhonePlaceholder={d?.formPhonePlaceholder}
        formSubmitLabel={d?.formSubmitLabel}
        formSubmitLoadingLabel={d?.formSubmitLoadingLabel}
        formSuccessHeading={d?.formSuccessHeading}
        formSuccessSubtext={d?.formSuccessSubtext}
        formErrorText={d?.formErrorText}
        formRateLimitedText={d?.formRateLimitedText}
        formNameMinError={d?.formNameMinError}
        formEmailInvalidError={d?.formEmailInvalidError}
      />
      <IndividualProgramsEditButton />
    </>
  )
}
