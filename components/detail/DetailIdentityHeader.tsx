'use client'

import { useState } from 'react'
import { Navigation, Share2, Edit3, MapPin, Route } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SuggestEditModal from './SuggestEditModal'
import ShareModal from './ShareModal'

interface DetailIdentityHeaderProps {
  mosqueId: number | null
  mosqueName: string | null
  address: string | null
  stateName: string | null
  cityName: string | null
  latitude: number | null
  longitude: number | null
  googleMapsUrl: string | null
  distanceStr?: string | null
}

export default function DetailIdentityHeader({
  mosqueId,
  mosqueName,
  address,
  stateName,
  cityName,
  latitude,
  longitude,
  googleMapsUrl,
  distanceStr,
}: DetailIdentityHeaderProps) {
  const [isSuggestOpen, setIsSuggestOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const resolvedAddress = address || (cityName ? `${cityName}, ${stateName}` : stateName || 'Malaysia')

  const handleDirections = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank')
    } else if (latitude && longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mosqueName || 'Masjid')}`, '_blank')
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://masjidsentral.com/mosque/${mosqueId}`

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 border-b border-[#D8D2C2] dark:border-[#355443]">
      
      {/* Identity Copy */}
      <div className="space-y-1.5 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#173524] dark:text-[#F7F5EF] leading-tight">
          {mosqueName || 'Masjid'}
        </h1>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#5A725F] dark:text-[#B8C8B9]">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0" />
            <span>{resolvedAddress}</span>
          </span>
          
          {distanceStr && (
            <>
              <span className="text-[#879B8A]">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECE7DA] dark:bg-[#203829] px-2 py-0.5 text-xs font-semibold text-[#173524] dark:text-[#F7F5EF]">
                <Route className="h-3 w-3 text-[#1F5A3B] dark:text-[#8BC99C]" />
                {distanceStr} away
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
        <Button
          onClick={handleDirections}
          className="bg-[#1F5A3B] hover:bg-[#173524] text-white gap-2 font-bold shadow-xs px-4"
        >
          <Navigation className="h-4 w-4" />
          <span>Get directions</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsShareOpen(true)}
          className="border-[#D8D2C2] dark:border-[#355443] text-[#173524] dark:text-[#F7F5EF] hover:bg-[#ECE7DA] dark:hover:bg-[#203829] gap-2 font-semibold"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsSuggestOpen(true)}
          className="border-[#D8D2C2] dark:border-[#355443] text-[#173524] dark:text-[#F7F5EF] hover:bg-[#ECE7DA] dark:hover:bg-[#203829] gap-2 font-semibold"
        >
          <Edit3 className="h-4 w-4" />
          <span>Suggest edit</span>
        </Button>
      </div>

      {/* Modals */}
      <SuggestEditModal
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
        mosqueName={mosqueName}
        mosqueId={mosqueId}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        mosqueName={mosqueName}
        url={currentUrl}
      />
    </div>
  )
}
