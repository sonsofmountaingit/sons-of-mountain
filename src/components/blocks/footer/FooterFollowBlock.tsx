'use client'

import { useTranslations } from '@/lib/use-translations'

type Props = {
  followHeading?: string
  followSubtext?: string
  facebookUrl?: string
  facebookFollowers?: string
  instagramUrl?: string
  instagramFollowers?: string
  tiktokUrl?: string
  tiktokFollowers?: string
}

export function FooterFollowBlock({
  followHeading,
  followSubtext,
  facebookUrl = 'https://facebook.com/sonsofmountains',
  facebookFollowers = '20.2K',
  instagramUrl = 'https://instagram.com/sonsofmountains',
  instagramFollowers = '23.8K',
  tiktokUrl = 'https://tiktok.com/@sonsofmountains',
  tiktokFollowers = '15.4K',
}: Props) {
  const { t } = useTranslations()
  const heading = followHeading ?? t.footer.follow_heading
  const subtext = followSubtext ?? t.footer_follow.subtext
  return (
    <div style={{ backgroundColor: '#1c1c1c', borderRadius: '1rem', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>{heading}</h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.55 }}>{subtext}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="8" fill="#1877F2"/><path d="M23 17c0-3.314-2.686-6-6-6s-6 2.686-6 6c0 2.995 2.193 5.477 5.063 5.927V18.89h-1.524V17h1.524v-1.323c0-1.504.896-2.334 2.265-2.334.656 0 1.342.117 1.342.117v1.476h-.756c-.744 0-.976.462-.976.936V17h1.66l-.265 1.89h-1.395v4.037C20.807 22.477 23 19.995 23 17z" fill="white"/></svg>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{facebookFollowers}</span>
        </a>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><defs><radialGradient id="ig-follow" cx="30%" cy="107%" r="120%"><stop offset="0%" stopColor="#ffd600"/><stop offset="30%" stopColor="#ff6930"/><stop offset="60%" stopColor="#fe3b93"/><stop offset="100%" stopColor="#9e34d4"/></radialGradient></defs><rect width="34" height="34" rx="8" fill="url(#ig-follow)"/><rect x="9" y="9" width="16" height="16" rx="4.5" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="17" cy="17" r="4" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="22" cy="12" r="1" fill="white"/></svg>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{instagramFollowers}</span>
        </a>
        {tiktokUrl && (
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#ffffff' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#000000"/><path d="M15.59 5.19a3.62 3.62 0 0 1-2.83-3.19V2h-2.59v10.25a2.17 2.17 0 0 1-2.16 1.88 2.17 2.17 0 0 1-2.17-2.17 2.17 2.17 0 0 1 2.17-2.17c.21 0 .4.03.59.08V7.26a4.75 4.75 0 0 0-.59-.04 4.75 4.75 0 0 0-4.75 4.75A4.75 4.75 0 0 0 8.01 16.72a4.75 4.75 0 0 0 4.75-4.75V6.52a6.12 6.12 0 0 0 3.58 1.14V5.19a3.64 3.64 0 0 1-.75-.05" fill="white"/></svg>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tiktokFollowers}</span>
          </a>
        )}
      </div>
    </div>
  )
}
