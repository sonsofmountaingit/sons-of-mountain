interface WaitlistJoinedEmailProps {
  itemTitle: string
  position: number
  recipientName: string
}

export function WaitlistJoinedEmail({
  itemTitle,
  position,
  recipientName,
}: WaitlistJoinedEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            You're on the Waitlist!
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Hi {recipientName},
          </p>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            You've successfully joined the waitlist for <strong>{itemTitle}</strong>.
          </p>

          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Your Position</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 0 0' }}>#{position}</p>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            We'll notify you as soon as a spot becomes available. Keep an eye on your inbox!
          </p>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            You received this email because you joined the waitlist for this experience.
          </p>
        </div>
      </body>
    </html>
  )
}
