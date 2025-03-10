import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-primary">
              MASJID SENTRAL
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tentang Kami
            </Link> */}
            {/* <Link href="/map" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Peta Masjid
            </Link>
            <Link href="/add" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tambah Masjid
            </Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add mobile menu button here if needed */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {/* <Button variant="ghost" className="text-primary">Log Masuk</Button>
            <Button className="bg-primary text-primary-foreground">Daftar</Button> */}
          </nav>
        </div>
      </div>
    </header>
  )
}

