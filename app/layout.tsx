import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SkillBond — Stake Your Goals',
  description: 'Verifiable accountability contracts for skill mastery. Lock funds, prove progress, earn trust.',
}

// NOTE: Google Fonts are loaded via <link> in production to avoid build-time fetch issues.
// To use next/font, uncomment below and ensure network access during build:
//
// import { Syne, DM_Sans } from 'next/font/google'
// const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' })
// const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
// then add className={`${syne.variable} ${dmSans.variable} ...`} to <body>

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#080B0F] text-zinc-100">
        {children}
      </body>
    </html>
  )
}
