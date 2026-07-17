'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  title: string
  lastUpdated: string
  content: unknown
}

export function PrivacyPolicyContentBlock({ title, lastUpdated, content }: Props) {
  return (
    <section style={{ padding: '4rem 1.5rem', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h1>
      {lastUpdated && (
        <p style={{ fontSize: '0.875rem', opacity: 0.5, marginBottom: '2.5rem' }}>
          Last updated: {lastUpdated}
        </p>
      )}
      {content ? (
        <div className="prose prose-invert max-w-none">
          <RichText data={content as Parameters<typeof RichText>[0]['data']} />
        </div>
      ) : null}
    </section>
  )
}
