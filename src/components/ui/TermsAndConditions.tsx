import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { TermsAndConditionsEditButton } from './TermsAndConditionsEditButton'

const getTermsAndConditionsData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'terms-and-conditions', overrideAccess: true })
    } catch {
      return null
    }
  },
  ['terms-and-conditions-global'],
  { tags: ['terms-and-conditions'], revalidate: false },
)

export async function TermsAndConditions() {
  const doc = await getTermsAndConditionsData() as any

  const title = doc?.title ?? 'Общи условия'
  const lastUpdated = doc?.lastUpdated ?? null
  const content = doc?.content ?? null

  const formatted = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <>
      <main
        style={{
          padding: '4rem 1.5rem',
          maxWidth: 860,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h1>
        {formatted && (
          <p style={{ fontSize: '0.875rem', opacity: 0.5, marginBottom: '2.5rem' }}>
            Последна актуализация: {formatted}
          </p>
        )}
        {content ? (
          <div
            className="prose prose-invert max-w-none"
            style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
            <RichText data={content} />
          </div>
        ) : null}
      </main>
      <TermsAndConditionsEditButton />
    </>
  )
}
