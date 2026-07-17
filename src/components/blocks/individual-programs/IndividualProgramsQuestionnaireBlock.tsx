import { IndividualProgramInquiryForm, type InquiryQuestion } from '@/components/forms/IndividualProgramInquiryForm'

interface Props {
  questionnaireHeading?: string
  questionnaireSubtext?: string
  questions?: InquiryQuestion[]
  formNamePlaceholder?: string
  formEmailPlaceholder?: string
  formPhonePlaceholder?: string
  formSubmitLabel?: string
  formSubmitLoadingLabel?: string
  formSuccessHeading?: string
  formSuccessSubtext?: string
  formErrorText?: string
  formRateLimitedText?: string
  formNameMinError?: string
  formEmailInvalidError?: string
}

export function IndividualProgramsQuestionnaireBlock({
  questionnaireHeading = 'Tell us about your journey',
  questionnaireSubtext = 'Fill out the questionnaire and we\'ll contact you within 24 hours with a personalized offer.',
  questions = [],
  formNamePlaceholder,
  formEmailPlaceholder,
  formPhonePlaceholder,
  formSubmitLabel,
  formSubmitLoadingLabel,
  formSuccessHeading,
  formSuccessSubtext,
  formErrorText,
  formRateLimitedText,
  formNameMinError,
  formEmailInvalidError,
}: Props) {
  return (
    <section id="questionnaire" style={{ background: '#0d0d0d', padding: '3rem 1rem sm:6rem sm:2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em', textAlign: 'center' }}>
          {questionnaireHeading}
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 3rem', textAlign: 'center' }}>
          {questionnaireSubtext}
        </p>
        <IndividualProgramInquiryForm
          questions={questions}
          namePlaceholder={formNamePlaceholder}
          emailPlaceholder={formEmailPlaceholder}
          phonePlaceholder={formPhonePlaceholder}
          submitLabel={formSubmitLabel}
          submitLoadingLabel={formSubmitLoadingLabel}
          successHeading={formSuccessHeading}
          successSubtext={formSuccessSubtext}
          errorText={formErrorText}
          rateLimitedText={formRateLimitedText}
          nameMinError={formNameMinError}
          emailInvalidError={formEmailInvalidError}
        />
      </div>
    </section>
  )
}
