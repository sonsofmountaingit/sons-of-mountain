interface LoyaltyTierUpgradeEmailProps {
  customerName: string
  newTier: string
  points: number
}

const TIER_INFO: Record<string, { icon: string; benefits: string[]; nextThreshold?: string }> = {
  bronze: {
    icon: '🥉',
    benefits: ['1% cashback on all purchases', 'Early access to seasonal sales'],
  },
  silver: {
    icon: '🥈',
    benefits: ['2% cashback on all purchases', 'Free shipping on orders over €50', 'Exclusive member discounts'],
  },
  gold: {
    icon: '🥇',
    benefits: ['3% cashback on all purchases', 'Free shipping on all orders', 'Priority customer support', 'Exclusive events access'],
  },
  platinum: {
    icon: '💎',
    benefits: ['5% cashback on all purchases', 'Free shipping on all orders', 'VIP customer support', 'Exclusive events & preview access', 'Personalized recommendations'],
  },
}

export function LoyaltyTierUpgradeEmail({
  customerName,
  newTier,
  points,
}: LoyaltyTierUpgradeEmailProps) {
  const tierInfo = TIER_INFO[newTier] || TIER_INFO.bronze

  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            Congratulations, {customerName}!
          </h1>

          <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '4px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', margin: '0 0 8px 0' }}>{tierInfo.icon}</p>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>New Tier Unlocked</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', textTransform: 'capitalize' }}>
              {newTier}
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
              {points} loyalty points
            </p>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            Your New Benefits
          </h2>

          <ul style={{ fontSize: '14px', color: '#666', marginBottom: '24px', paddingLeft: '20px' }}>
            {tierInfo.benefits.map((benefit, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                {benefit}
              </li>
            ))}
          </ul>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Thank you for being a valued customer. We're excited to offer you these exclusive rewards!
          </p>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            Your loyalty tier is automatically updated based on your points balance.
          </p>
        </div>
      </body>
    </html>
  )
}
