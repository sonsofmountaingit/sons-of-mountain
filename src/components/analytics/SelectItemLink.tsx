'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { gtagEvent } from '@/lib/gtag'

interface Props extends ComponentProps<typeof Link> {
  itemId: string
  itemName: string
  price: number
  listId: string
  listName: string
  itemCategory?: string
}

export function SelectItemLink({ itemId, itemName, price, listId, listName, itemCategory, onClick, ...linkProps }: Props) {
  return (
    <Link
      {...linkProps}
      onClick={(e) => {
        gtagEvent('select_item', {
          item_list_id: listId,
          item_list_name: listName,
          items: [{ item_id: itemId, item_name: itemName, price, item_category: itemCategory, quantity: 1 }],
        })
        onClick?.(e)
      }}
    />
  )
}
