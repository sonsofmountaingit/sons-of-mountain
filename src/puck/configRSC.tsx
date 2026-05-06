// This file contains RSC-compatible component definitions
// These components avoid client-only hooks (useState, useEffect, etc.)
// and can be rendered on the server using React Server Components

import type { Config } from '@puckeditor/core'

export const rscCompatibleComponents = {
  // Example: Server-side rendered components that don't use hooks
  // These can be used with <Render> component in server environments

  Note: `
    To use React Server Components with Puck:

    1. Avoid client-only hooks in component render functions:
       - useState, useEffect, useContext, useReducer, useCallback, useMemo
       - Instead, pass data as props from the server

    2. Mark components with 'use client' if they need interactivity:
       'use client'
       export function InteractiveComponent({ data }) { ... }

    3. Use <Render> component on server:
       import { Render } from '@puckeditor/core'
       export default function Page({ data, config }) {
         return <Render config={config} data={data} />
       }

    4. Use resolveAllData for server-side data resolution:
       import { resolveAllData } from '@puckeditor/core'
       const resolvedData = await resolveAllData(config, data)
  `,
} as any
