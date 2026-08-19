'use client'

import { useState } from 'react'
import { BookOpen, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ApiPreviewSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const endpoints = [
    {
      method: 'GET',
      path: '/masjids',
      desc: 'Paginated filterable masjid list with state, city, type, and keyword search',
      snippet: `{
  "data": [
    {
      "id": 1429,
      "name": "Masjid Negara",
      "type_id": "masjid_jamek",
      "state_id": "my-kul",
      "city_id": "my-kul-kl",
      "country_id": "my",
      "state_name": "W.P. Kuala Lumpur",
      "city_name": "Kuala Lumpur",
      "address": "Jalan Perdana, Tasik Perdana, 50480 Kuala Lumpur",
      "lat": 3.1412,
      "lng": 101.6915,
      "jumaat_available": 1,
      "status": "verified",
      "thumbnail_url": "https://images.masjidsentral.com/thumbnails/msj_1429.jpg"
    }
  ],
  "meta": { "total": 4812, "page": 1, "per_page": 20 }
}`,
    },
    {
      method: 'GET',
      path: '/masjids/{id}',
      desc: 'Get full detail profile including facilities, images, contacts, and reviews',
      snippet: `{
  "id": 1429,
  "name": "Masjid Negara",
  "type_id": "masjid_jamek",
  "state_id": "my-kul",
  "city_id": "my-kul-kl",
  "country_id": "my",
  "state_name": "W.P. Kuala Lumpur",
  "city_name": "Kuala Lumpur",
  "address": "Jalan Perdana, Tasik Perdana, 50480 Kuala Lumpur",
  "lat": 3.1412,
  "lng": 101.6915,
  "geohash": "w2837",
  "jumaat_available": 1,
  "status": "verified",
  "telephone": "+60 3-2693 7784",
  "google_url": "https://maps.google.com/?cid=123",
  "facilities": [
    { "id": 1, "masjid_id": 1429, "facility": "parking" },
    { "id": 2, "masjid_id": 1429, "facility": "wheelchair" }
  ]
}`,
    },
    {
      method: 'GET',
      path: '/masjids/nearby',
      desc: 'Geohash spatial proximity search sorted by distance (haversine)',
      snippet: `{
  "data": [
    {
      "id": 1429,
      "name": "Masjid Negara",
      "state_id": "my-kul",
      "city_id": "my-kul-kl",
      "lat": 3.1412,
      "lng": 101.6915,
      "distance_km": 0.45,
      "jumaat_available": 1,
      "status": "verified",
      "thumbnail_url": "https://images.masjidsentral.com/thumbnails/msj_1429.jpg"
    }
  ],
  "meta": { "total": 1, "page": 1, "per_page": 20 }
}`,
    },
    {
      method: 'GET',
      path: '/states',
      desc: 'Get reference list of states for state dropdown filters',
      snippet: `{
  "data": [
    { "id": "my-sgr", "name": "Selangor", "country_id": "my" },
    { "id": "my-kul", "name": "W.P. Kuala Lumpur", "country_id": "my" },
    { "id": "my-jhr", "name": "Johor", "country_id": "my" }
  ]
}`,
    },
  ]

  const current = endpoints[activeTab]

  const copySnippet = () => {
    navigator.clipboard.writeText(current.snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="api-preview" className="bg-white dark:bg-[#172D20] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D8D2C2] dark:border-[#355443]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Copy (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-widest text-[#1F5A3B] dark:text-[#8BC99C] uppercase bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 px-3.5 py-1 rounded-full border border-[#1F5A3B]/20">
              OPEN API
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#173524] dark:text-[#F7F5EF] tracking-tight">
              Use masjid data as infrastructure, not spreadsheet work.
            </h2>
            <p className="text-base text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
              Start from simple REST resources for listings, individual profiles, and spatial nearby searches. High performance powered by Cloudflare Workers & D1.
            </p>
            <div className="pt-2">
              <a href="https://api.masjidsentral.workers.dev" target="_blank" rel="noreferrer">
                <Button size="lg" className="bg-[#1F5A3B] text-white hover:bg-[#1F5A3B]/90 font-bold gap-2 shadow-md">
                  <BookOpen className="h-4 w-4" />
                  <span>Read API docs</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Right Interactive Code Console (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#102319] border border-[#355443] shadow-2xl overflow-hidden text-white">
            
            {/* Header / Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#355443] bg-[#08130D] px-4 py-3 gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {endpoints.map((ep, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                      activeTab === i
                        ? 'bg-[#E7C66A]/20 text-[#E7C66A] font-bold border border-[#E7C66A]/40'
                        : 'text-[#B8C8B9] hover:text-white hover:bg-[#172D20]'
                    }`}
                  >
                    <span className="text-[#8BC99C] font-bold mr-1">{ep.method}</span>
                    {ep.path}
                  </button>
                ))}
              </div>

              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-1.5 text-xs text-[#B8C8B9] hover:text-white px-2.5 py-1 rounded-md bg-[#172D20] border border-[#355443]"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#8BC99C]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Description Sub-bar */}
            <div className="bg-[#08130D]/60 px-5 py-2 border-b border-[#355443]/60 text-xs text-[#B8C8B9] font-sans italic">
              {current.desc}
            </div>

            {/* Code Output */}
            <div className="p-5 font-mono text-xs sm:text-sm text-[#DDE9DE] overflow-x-auto max-h-96">
              <pre className="leading-relaxed">
                <code>{current.snippet}</code>
              </pre>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
