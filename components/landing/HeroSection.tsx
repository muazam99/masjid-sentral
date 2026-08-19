'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Terminal, Send, MapPin, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MosqueView } from '@/types/Mosque'
import { formatLocationName } from '@/lib/api'

export default function HeroSection() {
  const [liveMosques, setLiveMosques] = useState<MosqueView[]>([])

  useEffect(() => {
    fetch('/api/mosque?limit=3')
      .then((res) => res.json() as Promise<{ data?: MosqueView[] }>)
      .then((resData) => {
        if (Array.isArray(resData.data) && resData.data.length > 0) {
          setLiveMosques(resData.data.slice(0, 3))
        }
      })
      .catch(() => {
        // Fallback to static preview items if network error
      })
  }, [])

  const defaultPreviewItems = [
    {
      id: 1429,
      name: 'Masjid Negara',
      city_name: 'Kuala Lumpur',
      state_name: 'W.P. Kuala Lumpur',
      status: 'verified',
    },
    {
      id: 1430,
      name: 'Masjid Sultan Salahuddin',
      city_name: 'Shah Alam',
      state_name: 'Selangor',
      status: 'verified',
    },
    {
      id: 1431,
      name: 'Masjid Zahir',
      city_name: 'Alor Setar',
      state_name: 'Kedah',
      status: 'verified',
    },
  ]

  const displayPreviewItems = liveMosques.length > 0 ? liveMosques : defaultPreviewItems

  return (
    <section className="relative overflow-hidden bg-[#102319] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#355443]">
      {/* Subtle Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#1F5A3B]/40 via-[#102319] to-[#102319] pointer-events-none" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#355443] bg-[#172D20] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#E7C66A] uppercase shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#E7C66A] animate-pulse" />
              OPEN MASJID DATA INFRASTRUCTURE
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Malaysia&apos;s central <span className="text-[#E7C66A]">masjid data layer</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#DDE9DE] max-w-2xl font-normal leading-relaxed">
              Search trusted mosque records, publish community corrections, and build apps on top of a stable open API for masjid locations, facilities, contacts, and verification status.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#api-preview">
                <Button size="lg" className="bg-[#C7A34D] text-[#102319] hover:bg-[#E7C66A] font-bold px-6 shadow-md gap-2 border-none">
                  <Terminal className="h-5 w-5" />
                  <span>Explore API</span>
                </Button>
              </a>

              <Link href="/directory">
                <Button size="lg" className="bg-[#1F5A3B] text-white hover:bg-[#1F5A3B]/80 font-semibold px-6 gap-2 border border-[#355443]">
                  <Send className="h-4 w-4 text-[#8BC99C]" />
                  <span>Explore Masjids</span>
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#355443] max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">4,812</p>
                <p className="text-xs text-[#B8C8B9] font-medium">masjid records</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">16</p>
                <p className="text-xs text-[#B8C8B9] font-medium">states covered</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#8BC99C]">99.9%</p>
                <p className="text-xs text-[#B8C8B9] font-medium">API uptime target</p>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Top Directory Preview Card */}
            <div className="rounded-xl border border-[#355443] bg-[#172D20] p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#355443] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#E7C66A]" />
                  <h3 className="text-sm font-bold text-white">Directory Preview</h3>
                </div>
                <span className="text-xs font-mono text-[#8BC99C] bg-[#0F1F17] border border-[#355443] px-2 py-0.5 rounded-md">
                  /masjids?limit=3
                </span>
              </div>

              {/* Sample Rows */}
              <div className="space-y-2 text-xs">
                {displayPreviewItems.map((item) => {
                  const city = formatLocationName(item.city_name)
                  const state = formatLocationName(item.state_name)
                  const locationStr = city ? `${city}, ${state}` : state || 'Malaysia'

                  return (
                    <Link
                      key={item.id}
                      href={`/mosque/${item.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#102319] border border-[#355443] hover:border-[#8BC99C]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <MapPin className="h-4 w-4 text-[#8BC99C] shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-white truncate group-hover:text-[#E7C66A] transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#B8C8B9] truncate">{locationStr}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#8BC99C] font-medium bg-[#0F1F17] px-2 py-0.5 rounded-full border border-[#1F5A3B] shrink-0">
                        <CheckCircle2 className="h-3 w-3" /> verified
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bottom API Code Response Card */}
            <div className="rounded-xl border border-[#355443] bg-[#08130D] p-4 font-mono text-xs shadow-2xl space-y-2">
              <div className="flex items-center justify-between text-[#B8C8B9] pb-2 border-b border-[#355443]">
                <span className="text-[#E7C66A] font-semibold">GET /masjids/1429</span>
                <span className="text-[10px] text-[#8BC99C]">200 OK</span>
              </div>
              <pre className="text-[#DDE9DE] leading-relaxed overflow-x-auto text-[11px]">
{`{
  "id": 1429,
  "name": "Masjid Negara",
  "type_id": "masjid_jamek",
  "state_id": "my-kul",
  "city_name": "Kuala Lumpur",
  "lat": 3.1412,
  "lng": 101.6915,
  "jumaat_available": 1,
  "status": "verified",
  "facilities": [
    { "facility": "parking" },
    { "facility": "wheelchair" }
  ]
}`}
              </pre>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
