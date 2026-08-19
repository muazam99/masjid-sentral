import { Accessibility, Car, Users, Wind, Heart, Train, Check } from 'lucide-react'

interface FacilityChipProps {
  facility: string
  size?: 'sm' | 'md'
}

export default function FacilityChip({ facility, size = 'sm' }: FacilityChipProps) {
  const norm = facility.toLowerCase().replace(/[\s-]/g, '_')

  let label = facility
  let Icon = Check

  if (norm.includes('wheelchair') || norm.includes('oku')) {
    label = 'Wheelchair'
    Icon = Accessibility
  } else if (norm.includes('parking') || norm.includes('letak_kereta')) {
    label = 'Parking'
    Icon = Car
  } else if (norm.includes('women') || norm.includes('wanita') || norm.includes('female')) {
    label = 'Women’s prayer'
    Icon = Users
  } else if (norm.includes('air') || norm.includes('ac')) {
    label = 'Air-conditioned'
    Icon = Wind
  } else if (norm.includes('nikah') || norm.includes('kahwin')) {
    label = 'Nikah services'
    Icon = Heart
  } else if (norm.includes('lrt') || norm.includes('mrt') || norm.includes('transit')) {
    label = 'LRT nearby'
    Icon = Train
  } else {
    label = facility.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  const isSmall = size === 'sm'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-[#F1EEE6] dark:bg-[#203829] text-[#5A725F] dark:text-[#B8C8B9] font-semibold border border-transparent transition-colors ${
        isSmall
          ? 'h-5 px-1.5 text-[9px]'
          : 'h-6.5 px-2 text-[11px]'
      }`}
    >
      <Icon className={isSmall ? 'h-2.5 w-2.5 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0' : 'h-3 w-3 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0'} />
      <span className="truncate">{label}</span>
    </span>
  )
}
