interface StockAlertEmailProps {
  itemTitle: string
  itemType: string
  itemUrl: string
  recipientEmail: string
}

export function StockAlertEmail({
  itemTitle,
  itemType,
  itemUrl,
  recipientEmail,
}: StockAlertEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            Back in Stock!
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Great news! The <strong>{itemTitle}</strong> you were waiting for is now back in stock.
          </p>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Item type: {itemType}
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
              View Item
            </a>
          </div>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            You received this email because you signed up for stock alerts at {recipientEmail}.
          </p>
        </div>
      </body>
    </html>
  )
}
