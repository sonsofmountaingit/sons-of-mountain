interface HowStep {
  step: string
  title: string
  description: string
}

interface Props {
  howHeading?: string
  howSubtext?: string
  howSteps?: HowStep[]
}

export function IndividualProgramsHowBlock({
  howHeading = 'Как работим',
  howSubtext = 'Процесът е прост — ти споделяш визията, ние я превръщаме в пътуване.',
  howSteps = [],
}: Props) {
  return (
    <section style={{ background: '#0d0d0d', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          {howHeading}
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 3rem', maxWidth: '60ch' }}>
          {howSubtext}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {howSteps.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e8501a', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
