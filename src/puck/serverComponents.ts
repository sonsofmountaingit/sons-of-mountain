// Server Components Support for Puck
// Enable React Server Components in the visual editor for better performance

import type { Config } from '@puckeditor/core'

export const serverComponentsConfig = {
  enable: true,
  defaultComponents: [
    'BlogPostsBlock',
    'StoriesBlock',
    'DestinationCarouselBlock',
    'SocialFeedBlock',
  ],
}

export function markComponentAsServerComponent<T extends Record<string, any>>(
  config: Config<any>,
  componentName: keyof T,
) {
  const components = config.components as Record<string, any> | undefined
  if (components && components[componentName as string]) {
    components[componentName as string]._isServerComponent = true
  }
  return config
}

export function getServerComponentRender(serverFetch: () => Promise<any>) {
  return async function render(props: any) {
    try {
      const data = await serverFetch()
      return { ...props, _data: data }
    } catch (err) {
      console.error('Server component fetch failed:', err)
      return props
    }
  }
}

// Usage:
// In components that fetch data (BlogPostsBlock, StoriesBlock, etc.),
// mark them as server components and use getServerComponentRender
// to fetch data during server-side rendering instead of client-side.
//
// Example:
// BlogPostsBlock: {
//   ...blockConfig,
//   _isServerComponent: true,
//   render: getServerComponentRender(async () => {
//     return fetch('/api/posts').then(r => r.json())
//   })
// }
