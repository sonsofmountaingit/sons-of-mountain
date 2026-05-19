interface OrderItem {
  title: string
  quantity: number
  unitPrice: number
}

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: OrderItem[]
  total: number
  currency: string
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  total,
  currency,
}: OrderConfirmationEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            Order Confirmed
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Hi {customerName},
          </p>

          <p style={{ fontSize: '16px', marginBottom: '24px' }}>
            Thank you for your order! We've confirmed your purchase and it's on its way.
          </p>

          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Order Number</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 16px 0' }}>{orderNumber}</p>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Order Details</h2>

          <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: idx < items.length - 1 ? '1px solid #eee' : 'none' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{item.title}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {currency}{(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '12px', borderTop: '2px solid #000' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {currency}{total.toFixed(2)}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            We'll send you tracking information as soon as your items ship.
          </p>
        </div>
      </body>
    </html>
  )
}
