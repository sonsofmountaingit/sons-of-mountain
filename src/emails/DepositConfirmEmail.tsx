interface DepositConfirmEmailProps {
  orderNumber: string
  depositAmount: number
  remainingBalance: number
  remainingDueDate: string
  tripTitle: string
}

export function DepositConfirmEmail({
  orderNumber,
  depositAmount,
  remainingBalance,
  remainingDueDate,
  tripTitle,
}: DepositConfirmEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', color: '#333' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ color: '#000', fontSize: '24px', marginBottom: '16px' }}>
            Deposit Confirmed
          </h1>

          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Thank you! We've received your deposit for <strong>{tripTitle}</strong>.
          </p>

          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Order Number</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 16px 0' }}>{orderNumber}</p>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Payment Breakdown</h2>

          <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '14px' }}>Deposit Paid Today</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>€{depositAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
              <span style={{ fontSize: '14px' }}>Remaining Balance Due</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>€{remainingBalance.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '12px', borderTop: '2px solid #000' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Total</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>€{(depositAmount + remainingBalance).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '4px', marginBottom: '24px', borderLeft: '4px solid #0084ff' }}>
            <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Payment Due Date</p>
            <p style={{ fontSize: '13px', margin: 0 }}>{remainingDueDate}</p>
          </div>

          <p style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            Please submit the remaining balance by the due date to secure your spot.
          </p>
        </div>
      </body>
    </html>
  )
}
