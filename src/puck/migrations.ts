import { migrate, transformProps, walkTree } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'

// Example: Migrate legacy data to new Puck versions
export function migrateData(data: Data) {
  return migrate(data)
}

// Example: Transform component props (e.g., renaming props)
export const componentTransforms = {
  // Rename 'title' prop to 'heading' in TextBlock
  TextBlock: ({ title, heading, ...props }: any) => ({
    heading: heading || title,
    ...props,
  }),

  // Convert 'buttonText' to 'ctaText' in CTABlock
  CTABlock: ({ buttonText, ctaText, ...props }: any) => ({
    ctaText: ctaText || buttonText,
    ...props,
  }),

  // Migrate old color format to new format
  HeroBlock: ({ bgColor, ...props }: any) => ({
    bgColor: bgColor?.startsWith('#') ? bgColor : `#${bgColor}`,
    ...props,
  }),
}

// Transform data using migrations
export function transformDataWithMigrations(data: Data) {
  return transformProps(data, componentTransforms)
}

// Walk through tree and apply custom transformations
export function walkAndTransformData(data: Data, transformer: (item: any) => any) {
  return walkTree(data, ({ item }) => {
    return transformer(item)
  })
}

// Version management
export const PUCK_VERSION = '0.25.0' // Update as Puck versions change
export const DATA_VERSION = 1

export function isDataUpToDate(data: Data & { _version?: number }) {
  return data._version === DATA_VERSION
}

export function upgradeData(data: Data) {
  const migratedData = migrateData(data)
  const transformedData = transformDataWithMigrations(migratedData)
  return {
    ...transformedData,
    _version: DATA_VERSION,
  }
}
