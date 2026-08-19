'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Landmark, Menu, X, Terminal } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Directory', href: '/directory' },
    { label: 'API Docs', href: '/docs' },
    { label: 'Submit', href: '/#submission-flow' },
    { label: 'About Us', href: '/#narrative' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#355443] bg-[#102319]/95 backdrop-blur-md text-white transition-colors">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5A3B] text-white shadow-xs transition-transform group-hover:scale-105 border border-[#355443]">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Masjid<span className="text-[#E7C66A] font-black">Sentral</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#355443] bg-[#172D20] p-1 px-3 shadow-inner">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === '/directory' && pathname.startsWith('/directory')) ||
              (link.href === '/docs' && pathname.startsWith('/docs'))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  isActive
                    ? 'bg-[#1F5A3B] text-[#E7C66A] shadow-xs font-bold border border-[#355443]'
                    : 'text-[#DDE9DE] hover:text-white hover:bg-[#102319]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/directory">
            <Button size="sm" className="bg-[#C7A34D] text-[#102319] hover:bg-[#E7C66A] font-bold shadow-xs gap-2 border-none">
              <Terminal className="h-4 w-4" />
              <span>Explore Masjids</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#DDE9DE] hover:text-white rounded-lg border border-[#355443] bg-[#172D20]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#355443] bg-[#102319] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium rounded-md text-[#DDE9DE] hover:bg-[#172D20] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <Link href="/directory" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-[#C7A34D] text-[#102319] font-bold gap-2">
                <Terminal className="h-4 w-4" />
                <span>Explore Masjids</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
