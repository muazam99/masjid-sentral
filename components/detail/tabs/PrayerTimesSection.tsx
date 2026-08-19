'use client'

import { useMemo } from 'react'
import { Info, Clock } from 'lucide-react'
import { calculatePrayerTimes } from '@/lib/prayer-times'

interface PrayerTimesSectionProps {
  latitude: number | null
  longitude: number | null
  cityName: string | null
  stateName: string | null
}

export default function PrayerTimesSection({
  latitude,
  longitude,
  cityName,
  stateName,
}: PrayerTimesSectionProps) {
  const locationLabel = cityName ? `${cityName}, ${stateName}` : stateName || 'Malaysia'

  const { items, dateFormatted } = useMemo(() => {
    return calculatePrayerTimes(latitude, longitude)
  }, [latitude, longitude])

  return (
    <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#173524] dark:text-[#F7F5EF]">
            Prayer Times
          </h2>
        </div>
        <span className="text-xs font-semibold text-[#5A725F] dark:text-[#B8C8B9] flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
          Today ({dateFormatted}) · {locationLabel}
        </span>
      </div>

      {/* 5 Prayer Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {items.map((prayer) => {
          const isActive = prayer.isNext
          return (
            <div
              key={prayer.key}
              className={`relative rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                isActive
                  ? 'bg-[#102319] dark:bg-[#0B1711] text-white border-2 border-[#C7A34D] shadow-md scale-102'
                  : 'bg-[#F7F5EF]/70 dark:bg-[#0F1F17]/50 border border-[#D8D2C2] dark:border-[#355443] text-[#173524] dark:text-[#F7F5EF]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2.5 rounded-full bg-[#C7A34D] text-[#102319] text-[9px] font-extrabold px-2 py-0.2 shadow-xs uppercase tracking-wider">
                  Upcoming
                </span>
              )}
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isActive ? 'text-[#E7C66A]' : 'text-[#5A725F] dark:text-[#B8C8B9]'
                }`}
              >
                {prayer.nameMalay}
              </span>
              <span
                className={`text-xl sm:text-2xl font-black mt-1 tracking-tight ${
                  isActive ? 'text-white' : 'text-[#173524] dark:text-[#F7F5EF]'
                }`}
              >
                {prayer.time}
              </span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isActive ? 'text-white/70' : 'text-[#5A725F]/70 dark:text-[#B8C8B9]/70'
                }`}
              >
                {prayer.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Disclaimer Note */}
      <div className="flex items-start gap-2 pt-2 text-xs text-[#5A725F] dark:text-[#B8C8B9] bg-[#F7F5EF]/40 dark:bg-[#0F1F17]/30 p-3 rounded-lg border border-[#D8D2C2]/40 dark:border-[#355443]/40">
        <Info className="h-4 w-4 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0 mt-0.5" />
        <p>
          Times are calculated for this masjid coordinates based on standard JAKIM astronomical algorithms. Slight variations may apply according to state religious department zones.
        </p>
      </div>
    </div>
  )
}
