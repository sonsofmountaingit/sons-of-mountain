import { BookingFormModal } from './BookingFormModal'

interface Trip {
  id: string
  title: string
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  price: number
  currency: string
  status: 'active' | 'soldOut' | 'draft'
  tags?: { tag: string }[]
}

interface Props {
  trip: Trip
}

export function BookingFormWrapper({ trip }: Props) {
  const tags = trip.tags?.map((t) => t.tag).filter(Boolean) ?? []

  return (
    <BookingFormModal
      trip={{
        ...trip,
        tags,
      }}
    />
  )
}
