'use client'

import dynamic from 'next/dynamic'
import { Navigation, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[240px] w-full rounded-xl overflow-hidden border border-[#D8D2C2] dark:border-[#355443] bg-muted flex items-center justify-center">
      <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">Loading interactive map...</p>
    </div>
  ),
})

interface LocationSectionProps {
  latitude: number | null
  longitude: number | null
  address: string | null
  googleMapsUrl: string | null
  mosqueName: string | null
}

export default function LocationSection({
  latitude,
  longitude,
  address,
  googleMapsUrl,
  mosqueName,
}: LocationSectionProps) {
  const handleDirections = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank')
    } else if (latitude && longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mosqueName || 'Masjid')}`, '_blank')
    }
  }

  return (
    <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#173524] dark:text-[#F7F5EF]">
          Location
        </h2>
      </div>

      {/* Map + Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Interactive Map */}
        <div className="md:col-span-7 h-[240px] w-full rounded-xl overflow-hidden border border-[#D8D2C2] dark:border-[#355443] shadow-inner">
          <LeafletMap
            latitude={latitude}
            longitude={longitude}
            googleMapsUrl={googleMapsUrl}
          />
        </div>

        {/* Address Info & Action */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5A725F] dark:text-[#B8C8B9]">
              Physical Address
            </span>
            <div className="flex items-start gap-2 text-sm sm:text-base font-semibold text-[#173524] dark:text-[#F7F5EF] leading-snug">
              <MapPin className="h-5 w-5 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0 mt-0.5" />
              <p>{address || 'Address details available via coordinates.'}</p>
            </div>
          </div>

          <div>
            <Button
              onClick={handleDirections}
              className="w-full sm:w-auto bg-[#1F5A3B] hover:bg-[#173524] text-white gap-2 font-bold shadow-xs"
            >
              <Navigation className="h-4 w-4" />
              <span>Get directions in Google Maps</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
