import Link from 'next/link'
import { Search, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CtaSection() {
  return (
    <section className="bg-[#102319] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-[#355443]">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1F5A3B]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Start with the public directory.<br />
          <span className="text-[#E7C66A]">Build on the API when ready.</span>
        </h2>
        <p className="text-base sm:text-lg text-[#DDE9DE] max-w-2xl mx-auto leading-relaxed">
          The home page leads into listing, API docs, and the submission workflow as the first complete product surface.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/directory">
            <Button size="lg" className="bg-[#C7A34D] text-[#102319] hover:bg-[#E7C66A] font-bold px-8 shadow-lg gap-2 border-none">
              <Search className="h-5 w-5" />
              <span>Browse masjids</span>
            </Button>
          </Link>
          <a href="#submission-flow">
            <Button size="lg" className="bg-[#1F5A3B] text-white hover:bg-[#1F5A3B]/80 font-bold px-8 gap-2 border border-[#355443]">
              <Send className="h-4 w-4 text-[#8BC99C]" />
              <span>Submit data</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
