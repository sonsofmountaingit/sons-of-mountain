'use client'

import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'
import { useTranslations } from '@/lib/use-translations'

type FreeTransferData = {
  image?: { url?: string | null; alt?: string | null } | null
  headline?: string | null
  paragraph?: string | null
  smallSpanText?: string | null
  departureDate?: string | null
  departureTime?: string | null
} | null | undefined

export function FreeTransferSection({ freeTransfer }: { freeTransfer: FreeTransferData }) {
  const { language } = useTranslations()
  if (!freeTransfer?.headline || !freeTransfer?.paragraph) return null

  const imageUrl = mediaUrl(freeTransfer.image?.url)
  const locale = language === 'EN' ? 'en-US' : 'bg-BG'
  const formattedDate = freeTransfer.departureDate
    ? new Date(freeTransfer.departureDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', padding: '3rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      {imageUrl && (
        <div style={{ position: 'relative', flex: '1 1 320px', minWidth: 280, aspectRatio: '4/3', borderRadius: '1rem', overflow: 'hidden' }}>
          <Image src={imageUrl} alt={freeTransfer.image?.alt ?? freeTransfer.headline} fill style={{ objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ flex: '1 1 320px', minWidth: 280 }}>
        {freeTransfer.smallSpanText && (
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7a7a' }}>
            {freeTransfer.smallSpanText}
          </span>
        )}
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>{freeTransfer.headline}</h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>{freeTransfer.paragraph}</p>
        {(formattedDate || freeTransfer.departureTime) && (
          <p style={{ marginTop: '1rem', fontWeight: 600 }}>
            {formattedDate}
            {formattedDate && freeTransfer.departureTime ? ' · ' : ''}
            {freeTransfer.departureTime}
          </p>
        )}
      </div>
    </section>
  )
}
