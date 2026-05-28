import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revalidateTag = (tag: string) => (_revalidateTag as any)(tag)

const safeAfter = (fn: () => void) => {
  try {
    after(fn)
  } catch {
    // Outside request scope (e.g. seeding) — skip revalidation.
  }
}

export const revalidateCollection = (tag: string, path: string): CollectionAfterChangeHook => {
  return ({ doc }) => {
    safeAfter(() => {
      revalidateTag(tag)
      revalidatePath(path, 'page')
      if (doc?.slug) {
        revalidatePath(`${path}/${doc.slug}`, 'page')
      }
    })
    return doc
  }
}

export const revalidateCollectionDelete = (tag: string, path: string): CollectionAfterDeleteHook => {
  return () => {
    safeAfter(() => {
      revalidateTag(tag)
      revalidatePath(path, 'page')
    })
  }
}

export const revalidateGlobal = (path: string) => {
  return ({ doc }: { doc: unknown }) => {
    safeAfter(() => {
      revalidatePath(path, 'layout')
      revalidatePath('/(frontend)', 'layout')
    })
    return doc
  }
}

export const revalidateFooter = () => {
  return ({ doc }: { doc: unknown }) => {
    safeAfter(() => {
      // Revalidate every frontend route so footer updates are instant
      revalidatePath('/', 'layout')
    })
    return doc
  }
}
