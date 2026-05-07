'use client'

import { FooterForm } from '@/components/ui/FooterForm'

type Props = {
  subscribeHeading?: string
  subscribeSubtext?: string
  submitLabel?: string
  firstNamePlaceholder?: string
  lastNamePlaceholder?: string
  emailPlaceholder?: string
  consentText?: string
  consentLinkText?: string
  privacyUrl?: string
}

export function FooterSubscribeBlock({
  subscribeHeading = 'Абонирай се',
  subscribeSubtext = 'Научавай първи за предстоящи пътешествия, отстъпки и събития.',
  submitLabel = 'Абонирай се',
  firstNamePlaceholder = 'Име',
  lastNamePlaceholder = 'Фамилия',
  emailPlaceholder = 'E-mail адрес',
  consentText = 'С натискането на бутона "Абонирай се" се съгласяваш с',
  consentLinkText = 'Политиката ни за поверителност',
  privacyUrl = '/legal/cookies',
}: Props) {
  return (
    <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.75rem 0' }}>{subscribeHeading}</h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>{subscribeSubtext}</p>
      <FooterForm
        privacyUrl={privacyUrl}
        submitLabel={submitLabel}
        firstNamePlaceholder={firstNamePlaceholder}
        lastNamePlaceholder={lastNamePlaceholder}
        emailPlaceholder={emailPlaceholder}
        consentText={consentText}
        consentLinkText={consentLinkText}
      />
    </div>
  )
}
