'use client'

import { useState, useEffect } from 'react'
import { FloatingBookingBar } from './FloatingBookingBar'
import { BookingDrawer } from './BookingDrawer'

interface Props {
  month?: string | null
  startDate?: string | null
  endDate?: string | null
  maxParticipants?: number | null
  durationDays?: number | null
  price: number
  currency: string
  tripId: string
  tripTitle: string
  itemType?: 'trip' | 'program'
  spotsAvailable?: number | null
  depositAmount?: number | null
}

export function DestinationBookingController(props: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-booking-drawer', handler)
    return () => window.removeEventListener('open-booking-drawer', handler)
  }, [])

  return (
    <>
      <FloatingBookingBar
        {...props}
        onBook={() => setOpen(true)}
      />
      <BookingDrawer
        open={open}
        onClose={() => setOpen(false)}
        tripId={props.tripId}
        tripTitle={props.tripTitle}
        price={props.price}
        currency={props.currency}
        spotsAvailable={props.spotsAvailable}
        depositAmount={props.depositAmount}
        startDate={props.startDate}
        endDate={props.endDate}
        durationDays={props.durationDays}
        month={props.month}
        itemType={props.itemType}
      />
    </>
  )
}
