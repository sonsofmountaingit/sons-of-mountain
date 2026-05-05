import { RichText } from '@payloadcms/richtext-lexical/react'

const variantMap: Record<string, string> = {
  'full-width': 'w-full',
  contained: 'max-w-3xl mx-auto',
  centered: 'max-w-2xl mx-auto',
}

interface RichTextBlockProps {
  block: {
    content?: unknown
    variant?: string | null
    bgColor?: string | null
    textColor?: string | null
  }
}

export function RichTextBlockRenderer({ block }: RichTextBlockProps) {
  const innerClass = variantMap[block.variant ?? 'contained'] ?? 'max-w-3xl mx-auto'

  return (
    <section
      className="py-16 px-6"
      style={{
        backgroundColor: block.bgColor ?? undefined,
        color: block.textColor ?? undefined,
      }}
    >
      <div className={`${innerClass} prose prose-invert max-w-none`}>
        {block.content ? <RichText data={block.content as Parameters<typeof RichText>[0]['data']} /> : null}
      </div>
    </section>
  )
}
