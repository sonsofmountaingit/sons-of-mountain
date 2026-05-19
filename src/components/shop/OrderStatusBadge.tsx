const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', classes: 'bg-green-100 text-green-800' },
  partial: { label: 'Partial', classes: 'bg-blue-100 text-blue-800' },
  refunded: { label: 'Refunded', classes: 'bg-purple-100 text-purple-800' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-800' },
}

export function OrderStatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, classes: 'bg-gray-100 text-gray-800' }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.classes}`}>
      {s.label}
    </span>
  )
}
