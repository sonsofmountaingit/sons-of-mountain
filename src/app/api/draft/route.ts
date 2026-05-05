import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const disable = searchParams.get('disable')

  const draft = await draftMode()

  if (disable) {
    draft.disable()
    return NextResponse.json({ draft: false })
  }

  draft.enable()
  redirect(`/${slug ?? ''}`)
}
