import type { Metadata } from 'next'
import { switzer, geistMono } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Avi Aggarwal',
  description:
    'Placeholder description — one sentence on who you are and what you build.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${switzer.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
