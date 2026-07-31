'use client'

import { useEffect } from 'react'
import { gtagEvent, type GtagItem } from '@/lib/gtag'

interface Props {
  listId: string
  listName: string
  items: GtagItem[]
}

export function ViewItemListTracker({ listId, listName, items }: Props) {
  useEffect(() => {
    if (!items.length) return
    gtagEvent('view_item_list', {
      item_list_id: listId,
      item_list_name: listName,
      items,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, listName, items.length])

  return null
}
