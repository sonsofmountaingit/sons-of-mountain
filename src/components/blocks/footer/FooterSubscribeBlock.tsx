'use client'

import { FooterForm } from '@/components/ui/FooterForm'
import { useTranslations } from '@/lib/use-translations'

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
  subscribeHeading,
  subscribeSubtext,
  submitLabel,
  firstNamePlaceholder,
  lastNamePlaceholder,
  emailPlaceholder,
  consentText,
  consentLinkText,
  privacyUrl = '/legal/privacy-policy',
}: Props) {
  const { t } = useTranslations()
  const heading = subscribeHeading ?? t.footer.newsletter_heading
  const subtext = subscribeSubtext ?? t.footer_subscribe.subtext
  const submit = submitLabel ?? t.footer.submit_label
  const firstName = firstNamePlaceholder ?? t.footer.firstname_placeholder
  const lastName = lastNamePlaceholder ?? t.footer.lastname_placeholder
  const email = emailPlaceholder ?? t.footer.email_placeholder
  const consent = consentText ?? t.footer.consent_text
  const consentLink = consentLinkText ?? t.footer.consent_link_text
  return (
    <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.75rem 0' }}>{heading}</h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>{subtext}</p>
      <FooterForm
        privacyUrl={privacyUrl}
        submitLabel={submit}
        firstNamePlaceholder={firstName}
        lastNamePlaceholder={lastName}
        emailPlaceholder={email}
        consentText={consent}
        consentLinkText={consentLink}
      />
    </div>
  )
}
