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
          heroHeading: d?.heroHeading ?? 'Индивидуални програми',
          heroSubtext: d?.heroSubtext ?? 'Пътуване, скроено изцяло по твоите желания — дестинация, дати, темпо и хора по твой избор.',
          heroCtaLabel: d?.heroCtaLabel ?? 'Изпрати запитване',
          heroCtaUrl: d?.heroCtaUrl ?? '#questionnaire',
          heroImageUrl,
        },
      },
      {
        type: 'IndividualProgramsOfferBlock',
        props: {
          id: 'ip-offer',
          offerHeading: d?.offerHeading ?? 'Какво предлагаме',
          offerSubtext: d?.offerSubtext ?? 'Индивидуална програма, изградена изцяло около теб — от идеята до последния ден.',
          offerItems: d?.offerItems ?? [],
        },
      },
      {
        type: 'IndividualProgramsHowBlock',
        props: {
          id: 'ip-how',
          howHeading: d?.howHeading ?? 'Как работим',
          howSubtext: d?.howSubtext ?? 'Процесът е прост — ти споделяш визията, ние я превръщаме в пътуване.',
          howSteps: d?.howSteps ?? [],
        },
      },
      {
        type: 'IndividualProgramsWhyBlock',
        props: {
          id: 'ip-why',
          whyHeading: d?.whyHeading ?? 'Защо индивидуална програма',
          whySubtext: d?.whySubtext ?? 'Защото всяко пътешествие е лично и заслужава собствена история.',
          whyImageUrl,
          whyPoints: d?.whyPoints ?? [],
        },
      },
      {
        type: 'IndividualProgramsQuestionnaireBlock',
        props: {
          id: 'ip-questionnaire',
          questionnaireHeading: d?.questionnaireHeading ?? 'Разкажи ни за твоето пътуване',
          questionnaireSubtext: d?.questionnaireSubtext ?? 'Попълни въпросника и ще се свържем с теб в рамките на 24 часа с персонализирано предложение.',
          questions: d?.questions ?? [],
          formNamePlaceholder: d?.formNamePlaceholder ?? 'Твоето име',
          formEmailPlaceholder: d?.formEmailPlaceholder ?? 'Имейл адрес',
          formPhonePlaceholder: d?.formPhonePlaceholder ?? 'Телефон',
          formSubmitLabel: d?.formSubmitLabel ?? 'Изпрати запитване',
          formSubmitLoadingLabel: d?.formSubmitLoadingLabel ?? 'Изпращане...',
          formSuccessHeading: d?.formSuccessHeading ?? 'Получихме твоето запитване!',
          formSuccessSubtext: d?.formSuccessSubtext ?? 'Благодарим ти! Ще се свържем с теб съвсем скоро.',
          formErrorText: d?.formErrorText ?? 'Възникна грешка. Моля, опитай отново.',
          formRateLimitedText: d?.formRateLimitedText ?? 'Твърде много опити. Опитай отново по-късно.',
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
