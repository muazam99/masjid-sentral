import Link from 'next/link'
import { Landmark, Code2, Globe, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#355443] bg-[#08130D] text-slate-100 transition-colors">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5A3B] text-white shadow-xs border border-[#355443]">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Masjid<span className="text-[#E7C66A] font-black">Sentral</span>
              </span>
            </Link>
            <p className="text-xs text-[#B8C8B9] leading-relaxed">
              Canonical, open-source database & public API of every masjid, surau, and musolla in Malaysia & Southeast Asia.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[#B8C8B9]">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <Code2 className="h-5 w-5" />
              </a>
              <a
                href="https://jejakmasjid.my"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Jejak Masjid"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E7C66A] mb-4">
              Data Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#DDE9DE]">
              <li>
                <Link href="/directory" className="hover:text-white transition-colors">
                  Masjid Directory
                </Link>
              </li>
              <li>
                <Link href="/#api-preview" className="hover:text-white transition-colors">
                  Open API Endpoints
                </Link>
              </li>
              <li>
                <Link href="/#submission-flow" className="hover:text-white transition-colors">
                  Submit & Correct Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Partners */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E7C66A] mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs text-[#DDE9DE]">
              <li>
                <a href="https://jejakmasjid.my" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Jejak Masjid (jejakmasjid.my)
                </a>
              </li>
              <li>
                <a href="https://qiyam.catchupmobility.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Qiyam App
                </a>
              </li>
            </ul>
          </div>

          {/* Open License */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E7C66A] mb-4">
              Open Data License
            </h4>
            <p className="text-xs text-[#B8C8B9] leading-relaxed">
              Code licensed under <span className="text-white font-medium">MIT</span>. Dataset licensed under <span className="text-white font-medium">ODC-ODbL</span> (Open Database License).
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#355443]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B8C8B9] gap-4">
          <p>© {new Date().getFullYear()} Masjid Sentral. Joint initiative by Jejak Masjid & Qiyam.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 inline" /> for the Ummah.
          </p>
        </div>
      </div>
    </footer>
  )
}
