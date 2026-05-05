export function QuoteBlockRenderer({ block }: {
  block: {
    quote: string
    author?: string | null
    role?: string | null
    bgColor?: string | null
    textColor?: string | null
    paddingTop?: string | null
    paddingBottom?: string | null
  }
}) {
  return (
    <section
      className="px-6"
      style={{
        backgroundColor: block.bgColor || undefined,
        color: block.textColor || undefined,
        paddingTop: block.paddingTop ?? '5rem',
        paddingBottom: block.paddingBottom ?? '5rem',
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-6 opacity-80">
          &ldquo;{block.quote}&rdquo;
        </blockquote>
        {block.author && (
          <div>
            <p className="text-sm font-semibold">{block.author}</p>
            {block.role && <p className="text-xs opacity-40 mt-1">{block.role}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
