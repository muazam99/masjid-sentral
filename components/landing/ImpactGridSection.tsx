'use client'

import { useEffect, useState } from 'react'

export default function ImpactGridSection() {
  const [recordCount, setRecordCount] = useState<string>('4.8k+')

  useEffect(() => {
    // Optionally fetch live total record count from API
    fetch('/api/mosque?limit=1')
      .then((res) => res.json() as Promise<{ count?: number }>)
      .then((data) => {
        if (typeof data.count === 'number' && data.count > 0) {
          setRecordCount(`${data.count.toLocaleString()}+`)
        }
      })
      .catch(() => {
        // Fallback to default canonical seed count
      })
  }, [])

  const metrics = [
    { value: recordCount, label: 'verified records' },
    { value: '16', label: 'states & territories' },
    { value: '3', label: 'core API groups' },
  ]

  return (
    <section className="bg-[#1F5A3B] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#355443] shadow-inner">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#E7C66A]">
              DATA COVERAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Built for national scale.
            </h2>
            <p className="text-sm opacity-90 text-[#DDE9DE] leading-relaxed">
              Consolidating JAKIM and state Islamic affairs registries into one normalized, open-database schema across all Malaysian states.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:text-left">
            {metrics.map((m, idx) => (
              <div key={idx} className="rounded-xl bg-[#102319]/50 backdrop-blur-xs p-6 border border-white/20 shadow-md">
                <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  {m.value}
                </p>
                <p className="mt-1.5 text-base font-semibold text-[#DDE9DE]">{m.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
