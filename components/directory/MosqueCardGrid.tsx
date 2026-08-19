import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Route } from 'lucide-react'
import { MosqueView } from '@/types/Mosque'
import { formatLocationName } from '@/lib/api'
import FacilityChip from './FacilityChip'
import placeholderImg from '@/public/placeholder.svg'

interface MosqueCardGridProps {
  mosque: MosqueView
  distanceStr?: string
}

export default function MosqueCardGrid({ mosque, distanceStr }: MosqueCardGridProps) {
  const formattedCity = formatLocationName(mosque.city_name)
  const formattedState = formatLocationName(mosque.state_name)
  const locationLabel = mosque.address || (formattedCity
    ? `${formattedCity}, ${formattedState}`
    : formattedState || 'Malaysia')

  const facilities = (mosque.facilities ?? []).slice(0, 3)

  return (
    <Link href={`/mosque/${mosque.id}`} className="group block">
      <div className="h-[300px] w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] overflow-hidden transition-all duration-300 flex flex-col hover:border-[#1F5A3B] dark:hover:border-[#8BC99C]">
        
        {/* Photo Container - Fixed Height 165px */}
        <div className="relative h-[165px] w-full bg-muted overflow-hidden shrink-0">
          <Image
            src={mosque.image_path || placeholderImg}
            alt={mosque.name || 'Masjid'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </div>

        {/* Content Details Container - Padding [10px, 12px, 12px, 12px] */}
        <div className="pt-[10px] px-[12px] pb-[12px] flex-1 flex flex-col space-y-1.5">
          
          {/* Title Row */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#173524] dark:text-[#F7F5EF] line-clamp-1 group-hover:text-[#1F5A3B] dark:group-hover:text-[#8BC99C] transition-colors">
              {mosque.name}
            </h3>
            {distanceStr && (
              <span className="inline-flex items-center gap-1 h-5 rounded-full bg-[#F1EEE6] dark:bg-[#203829] px-1.5 text-[9px] font-bold text-[#173524] dark:text-[#F7F5EF] shrink-0">
                <Route className="h-2.5 w-2.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
                {distanceStr}
              </span>
            )}
          </div>

          {/* Address Row */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#5A725F] dark:text-[#B8C8B9]">
            <MapPin className="h-3 w-3 text-[#5A725F] dark:text-[#B8C8B9] shrink-0" />
            <span className="line-clamp-1">{locationLabel}</span>
          </div>

          {/* Facility Chips Row */}
          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {facilities.map((fac, idx) => (
                <FacilityChip key={idx} facility={fac} size="sm" />
              ))}
            </div>
          )}

        </div>

      </div>
    </Link>
  )
}
