import Link from 'next/link'

interface CTABlockProps {
  block: {
    headline: string
    body?: string | null
    buttonText?: string | null
    buttonLink?: string | null
    bgColor?: string | null
    textColor?: string | null
    variant?: string | null
  }
}

export function CTABlockRenderer({ block }: CTABlockProps) {
  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: block.bgColor ?? '#111111',
        color: block.textColor ?? '#ffffff',
      }}
    >
      <div className={block.variant === 'centered' || !block.variant ? 'text-center max-w-2xl mx-auto' : 'max-w-5xl mx-auto'}>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{block.headline}</h2>
        {block.body && (
          <p className="text-base text-white/60 mb-8 max-w-xl mx-auto">{block.body}</p>
        )}
        {block.buttonText && block.buttonLink && (
          <Link
            href={block.buttonLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors"
          >
            {block.buttonText}
          </Link>
        )}
      </div>
    </section>
  )
}
