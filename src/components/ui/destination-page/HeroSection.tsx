import Image from 'next/image'

interface Props {
  title: string
  subtitle?: string | null
  heroImage: string
  heroImageAlt?: string
}

export function HeroSection({ title, subtitle, heroImage, heroImageAlt }: Props) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <Image
        src={heroImage}
        alt={heroImageAlt ?? title}
        fill
        priority
        quality={90}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tight leading-none mb-6"
          style={{ animation: 'heroTitleIn 0.7s cubic-bezier(0.22,1,0.36,1) both' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed"
            style={{ animation: 'heroTitleIn 0.7s 0.25s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <style>{`
        @keyframes heroTitleIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="heroTitleIn"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
