'use client'

import { Render } from '@puckeditor/core'
import { puckConfig } from '@/puck/config'
import type { Data } from '@puckeditor/core'

export function PuckRender({ data }: { data: Data }) {
  return <Render config={puckConfig} data={data} />
}
