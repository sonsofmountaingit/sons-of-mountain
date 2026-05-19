interface ReferralCodeEmailProps {
  code: string
  discountPercent: number
  recipientName: string
}

export function ReferralCodeEmail({
  code,
  discountPercent,
  recipientName,
}: ReferralCodeEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            Share Your Referral Code
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Hi {recipientName},
          </p>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            We'd love for you to share Sons of Mountains with friends and family. Use your unique referral code to earn rewards!
          </p>

          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '4px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>Your Referral Code</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {code}
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
              {discountPercent}% discount for your friends
            </p>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
            How it works:
          </p>

          <ul style={{ fontSize: '14px', color: '#666', marginBottom: '24px', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Share your code with friends</li>
            <li style={{ marginBottom: '8px' }}>They get {discountPercent}% off their first order</li>
            <li>You earn rewards for each successful referral</li>
          </ul>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            Keep this code safe and share it everywhere.
          </p>
        </div>
      </body>
    </html>
  )
}
