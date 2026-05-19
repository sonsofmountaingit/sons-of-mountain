interface CartItem {
  title: string
  price: number
}

interface AbandonedCartEmailProps {
  cartItems: CartItem[]
  totalAmount: number
  checkoutUrl: string
}

export function AbandonedCartEmail({
  cartItems,
  totalAmount,
  checkoutUrl,
}: AbandonedCartEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            You Left Something Behind
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            We noticed you didn't complete your purchase. Your items are still waiting for you.
          </p>

          <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: idx < cartItems.length - 1 ? '1px solid #eee' : 'none' }}>
                <span style={{ fontSize: '14px' }}>{item.title}</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>€{item.price.toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '12px', borderTop: '2px solid #000' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <a
              href={checkoutUrl}
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
              Complete Checkout
            </a>
          </div>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            This link expires in 24 hours. After that, you may need to add items to your cart again.
          </p>
        </div>
      </body>
    </html>
  )
}
