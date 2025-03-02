"use client"

import { Inter } from 'next/font/google'
import { ThemeProvider } from "next-themes"
import Header from './Header'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`min-h-screen bg-background ${inter.className}`}>
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ThemeProvider>
  )
}

