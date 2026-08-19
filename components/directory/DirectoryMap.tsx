'use client'

import dynamic from 'next/dynamic'
import { MosqueView } from '@/types/Mosque'

const DirectoryMapCore = dynamic(() => import('./DirectoryMapCore'), {
  ssr: false,
  loading: () => (
    <div className="h-150 w-full rounded-2xl border border-border bg-muted flex items-center justify-center">
      <p className="text-sm font-medium text-muted-foreground">Loading interactive map...</p>
    </div>
  ),
})

interface DirectoryMapProps {
  mosques: MosqueView[]
  height?: string
  isLoading?: boolean
  onSearchArea?: (center: { lat: number; lng: number }, radius: number) => void
  resetRecenterTrigger?: number
  userLocation?: { lat: number; lng: number } | null
  locateTrigger?: number
}

export default function DirectoryMap({
  mosques,
  height = '600px',
  isLoading,
  onSearchArea,
  resetRecenterTrigger,
  userLocation,
  locateTrigger,
}: DirectoryMapProps) {
  return (
    <DirectoryMapCore
      mosques={mosques}
      height={height}
      isLoading={isLoading}
      onSearchArea={onSearchArea}
      resetRecenterTrigger={resetRecenterTrigger}
      userLocation={userLocation}
      locateTrigger={locateTrigger}
    />
  )
}
