import Image from 'next/image'
import Link from 'next/link'
import { Route, CheckCircle2 } from 'lucide-react'
import { MosqueView } from '@/types/Mosque'
import { formatLocationName } from '@/lib/api'
import FacilityChip from './FacilityChip'
import placeholderImg from '@/public/placeholder.svg'

interface MosqueCardListProps {
  mosque: MosqueView
  distanceStr?: string
}

export default function MosqueCardList({ mosque, distanceStr }: MosqueCardListProps) {
  const formattedCity = formatLocationName(mosque.city_name)
  const formattedState = formatLocationName(mosque.state_name)
  const locationLabel = mosque.address || (formattedCity
    ? `${formattedCity}, ${formattedState}`
    : formattedState || 'Malaysia')

  const sampleFacilities = ['wheelchair', 'parking', 'women']

  return (
    <Link href={`/mosque/${mosque.id}`} className="group block">
      <div className="h-[142px] w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] overflow-hidden transition-all duration-300 flex items-center gap-4.5 hover:border-[#1F5A3B] dark:hover:border-[#8BC99C]">
        
        {/* Photo Thumbnail - Fixed Width 128px, Height 100% */}
        <div className="relative h-full w-[128px] bg-muted overflow-hidden shrink-0 rounded-l-lg">
          <Image
            src={mosque.image_path || placeholderImg}
            alt={mosque.name || 'Masjid'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 backdrop-blur-xs">
            <CheckCircle2 className="h-2.5 w-2.5" /> verified
          </span>
        </div>

        {/* Details Column - Gap 9px, Right Padding 18px */}
        <div className="flex-1 min-w-0 pr-4.5 py-3 flex flex-col justify-center space-y-2">
          
          {/* Title Row */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-[#173524] dark:text-[#F7F5EF] truncate group-hover:text-[#1F5A3B] dark:group-hover:text-[#8BC99C] transition-colors">
              {mosque.name}
            </h3>
            {distanceStr && (
              <span className="inline-flex items-center gap-1.5 h-6.5 rounded-full bg-[#F1EEE6] dark:bg-[#203829] px-2.5 text-[11px] font-bold text-[#173524] dark:text-[#F7F5EF] shrink-0">
                <Route className="h-3 w-3 text-[#1F5A3B] dark:text-[#8BC99C]" />
                {distanceStr}
              </span>
            )}
          </div>

          {/* Address Line */}
          <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9] truncate font-normal">
            {locationLabel}
          </p>

          {/* Facility Chips Row */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {sampleFacilities.map((fac, idx) => (
              <FacilityChip key={idx} facility={fac} size="md" />
            ))}
          </div>

        </div>

      </div>
    </Link>
  )
}
