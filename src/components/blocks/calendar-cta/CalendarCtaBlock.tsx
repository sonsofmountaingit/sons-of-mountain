import Link from 'next/link'

interface Props {
  heading?: string
  subheading?: string
  buttonText?: string
  buttonUrl?: string
}

export function CalendarCtaBlock({
  heading = 'Търсиш следващото приключение?',
  subheading = 'Разгледай всички предстоящи пътувания.',
  buttonText = 'Виж календара',
  buttonUrl = '/calendar',
}: Props) {
  return (
    <section style={{ backgroundColor: '#ffffff', padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#111111', margin: '0 0 1rem 0', lineHeight: 1.2 }}>
          {heading}
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(17,17,17,0.55)', margin: '0 0 2rem 0', lineHeight: 1.6 }}>
          {subheading}
        </p>
        <Link
          href={buttonUrl ?? '/calendar'}
          style={{
            display: 'inline-block',
            backgroundColor: '#c0442a',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '0.85rem 2rem',
            borderRadius: '2rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
