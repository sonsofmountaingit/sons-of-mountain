interface WaitlistNotificationEmailProps {
  itemTitle: string
  itemUrl: string
  recipientName: string
}

export function WaitlistNotificationEmail({
  itemTitle,
  itemUrl,
  recipientName,
}: WaitlistNotificationEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            A Spot Just Opened!
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Hi {recipientName},
          </p>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Good news! A spot has just become available for <strong>{itemTitle}</strong>.
          </p>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            This is your moment to secure your spot. Act fast—spaces fill up quickly.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <a
              href={itemUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#000',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Book Now
            </a>
          </div>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            You received this email because you joined the waitlist for this experience.
          </p>
        </div>
      </body>
    </html>
  )
}
