import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { after } from 'next/server'

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
      revalidateTag(tag, 'default')
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
      revalidateTag(tag, 'default')
      revalidatePath(path, 'page')
    })
  }
}

export const revalidateGlobal = (path: string) => {
  return ({ doc }: { doc: unknown }) => {
    safeAfter(() => {
      revalidatePath(path, 'layout')
    })
    return doc
  }
}
