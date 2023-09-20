import React from 'react'
import Link from 'next/link'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <main>
          <Link href="/">Home</Link>
          <hr />
          {children}
        </main>
      </body>
    </html>
  )
}
