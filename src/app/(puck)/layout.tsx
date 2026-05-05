import type { Metadata } from 'next'
import '../globals.css'
import '@puckeditor/core/puck.css'

export const metadata: Metadata = {
  title: 'Visual Editor',
  robots: 'noindex, nofollow',
}

export default function PuckLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        {/*
          globals.css sets body { color: #fff; background: #0a0a0a } which bleeds into
          Puck's light-themed chrome (sidebar, fields panel). We reset it here for the
          editor shell only. The canvas preview runs in its own <iframe> so it is unaffected.
        */}
        <style>{`
          body {
            color: #111111 !important;
            background: #f0f0f0 !important;
          }
          /* Field inputs inherit dark bg from globals — reset them */
          input, textarea, select, button {
            color: inherit;
          }
        `}</style>
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
