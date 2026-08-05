// §5 — Display grotesk + technical mono.
import localFont from 'next/font/local'
import { Geist_Mono } from 'next/font/google'

export const switzer = localFont({
  src: './fonts/Switzer-Variable.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-switzer',
  adjustFontFallback: 'Arial',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})
