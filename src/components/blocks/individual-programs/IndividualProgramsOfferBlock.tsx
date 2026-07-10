interface OfferItem {
  title: string
  description: string
  icon?: string
}

interface Props {
  offerHeading?: string
  offerSubtext?: string
  offerItems?: OfferItem[]
}

export function IndividualProgramsOfferBlock({
  offerHeading = 'Какво предлагаме',
  offerSubtext = 'Индивидуална програма, изградена изцяло около теб — от идеята до последния ден.',
  offerItems = [],
}: Props) {
  return (
    <section style={{ background: '#0a0a0a', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          {offerHeading}
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 3rem', maxWidth: '60ch' }}>
          {offerSubtext}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {offerItems.map((item, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '2rem',
              }}
            >
              {item.icon && <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
