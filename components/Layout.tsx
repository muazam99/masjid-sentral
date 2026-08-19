'use client'

import { ThemeProvider } from 'next-themes'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary/20">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
