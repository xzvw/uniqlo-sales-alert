import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Uniqlo Sales Alert',
}

export type RootLayoutProps = Readonly<{
  children: ReactNode
}>

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
