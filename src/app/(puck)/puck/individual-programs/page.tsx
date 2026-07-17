import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckIndividualProgramsEditorClient } from './PuckIndividualProgramsEditorClient'
import { mediaUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const d = (await payload.findGlobal({ slug: 'individual-programs-page', depth: 2 })) as any

  const heroImageUrl = mediaUrl(typeof d?.heroImage === 'object' ? d?.heroImage?.url : null) ?? ''
  const whyImageUrl = mediaUrl(typeof d?.whyImage === 'object' ? d?.whyImage?.url : null) ?? ''

  const puckData: Data = d?.puckData?.content?.length ? d.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'IndividualProgramsHeroBlock',
        props: {
          id: 'ip-hero',
          heroHeading: d?.heroHeading ?? 'Individual Programs',
          heroSubtext: d?.heroSubtext ?? 'A journey tailored entirely to your wishes — destination, dates, pace, and people of your choice.',
          heroCtaLabel: d?.heroCtaLabel ?? 'Send inquiry',
          heroCtaUrl: d?.heroCtaUrl ?? '#questionnaire',
          heroImageUrl,
        },
      },
      {
        type: 'IndividualProgramsOfferBlock',
        props: {
          id: 'ip-offer',
          offerHeading: d?.offerHeading ?? 'What we offer',
          offerSubtext: d?.offerSubtext ?? 'An individual program built entirely around you — from idea to last day.',
          offerItems: d?.offerItems ?? [],
        },
      },
      {
        type: 'IndividualProgramsHowBlock',
        props: {
          id: 'ip-how',
          howHeading: d?.howHeading ?? 'How we work',
          howSubtext: d?.howSubtext ?? 'The process is simple — you share the vision, we turn it into a journey.',
          howSteps: d?.howSteps ?? [],
        },
      },
      {
        type: 'IndividualProgramsWhyBlock',
        props: {
          id: 'ip-why',
          whyHeading: d?.whyHeading ?? 'Why individual program',
          whySubtext: d?.whySubtext ?? 'Because every journey is personal and deserves its own story.',
          whyImageUrl,
          whyPoints: d?.whyPoints ?? [],
        },
      },
      {
        type: 'IndividualProgramsQuestionnaireBlock',
        props: {
          id: 'ip-questionnaire',
          questionnaireHeading: d?.questionnaireHeading ?? 'Tell us about your journey',
          questionnaireSubtext: d?.questionnaireSubtext ?? 'Fill out the questionnaire and we will contact you within 24 hours with a personalized offer.',
          questions: d?.questions ?? [],
          formNamePlaceholder: d?.formNamePlaceholder ?? 'Your name',
          formEmailPlaceholder: d?.formEmailPlaceholder ?? 'Email address',
          formPhonePlaceholder: d?.formPhonePlaceholder ?? 'Phone',
          formSubmitLabel: d?.formSubmitLabel ?? 'Send inquiry',
          formSubmitLoadingLabel: d?.formSubmitLoadingLabel ?? 'Sending...',
          formSuccessHeading: d?.formSuccessHeading ?? 'We received your inquiry!',
          formSuccessSubtext: d?.formSuccessSubtext ?? 'Thank you! We will contact you soon.',
          formErrorText: d?.formErrorText ?? 'An error occurred. Please try again.',
          formRateLimitedText: d?.formRateLimitedText ?? 'Too many attempts. Try again later.',
          formNameMinError: d?.formNameMinError ?? 'Минимум 2 символа',
          formEmailInvalidError: d?.formEmailInvalidError ?? 'Невалиден имейл',
        },
      },
    ],
  }

  return <PuckIndividualProgramsEditorClient initialData={puckData} />
}

export default function PuckIndividualProgramsEditorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading Visual Editor…
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
