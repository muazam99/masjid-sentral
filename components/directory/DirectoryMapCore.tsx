'use client'

import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { MosqueView } from '@/types/Mosque'
import { formatLocationName } from '@/lib/api'

// Escape attribute strings defensively for custom HTML pin
const escapeHtmlAttr = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Custom Emerald Landmark Pin Icon
const createEmeraldPinIcon = (name: string) =>
  L.divIcon({
    className: 'custom-emerald-pin',
    html: `<div style="
      background-color: #1F5A3B;
      color: #FFFFFF;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid #FFFFFF;
    " title="${escapeHtmlAttr(name)}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

// Map View Recenter Controller Component (only recenters on filter changes)
function MapRecenter({
  mosques,
  resetRecenterTrigger,
}: {
  mosques: MosqueView[]
  resetRecenterTrigger?: number
}) {
  const map = useMap()
  const initialFitDone = useRef(false)
  const lastTrigger = useRef<number | undefined>(resetRecenterTrigger)

  useEffect(() => {
    const isExplicitTrigger = resetRecenterTrigger !== undefined && resetRecenterTrigger !== lastTrigger.current
    const shouldRecenter = isExplicitTrigger || (!initialFitDone.current && mosques.length > 0)

    if (shouldRecenter) {
      if (isExplicitTrigger) {
        lastTrigger.current = resetRecenterTrigger
      }
      initialFitDone.current = true

      const validCoords = mosques
        .filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number' && !isNaN(m.lat) && !isNaN(m.lng) && m.lat !== 0 && m.lng !== 0)
        .map((m) => [m.lat!, m.lng!] as [number, number])

      if (validCoords.length === 1) {
        map.setView(validCoords[0], 14, { animate: true })
      } else if (validCoords.length > 1) {
        const bounds = L.latLngBounds(validCoords)
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true })
      }
    }
  }, [mosques, resetRecenterTrigger, map])

  return null
}

// Map Event Listener for Pan & Zoom (strictly user-initiated via DOM input events)
function MapEventsHandler({
  onSearchArea,
  resetRecenterTrigger,
}: {
  onSearchArea?: (center: { lat: number; lng: number }, radius: number) => void
  resetRecenterTrigger?: number
}) {
  const map = useMap()
  const onSearchAreaRef = useRef(onSearchArea)
  useEffect(() => {
    onSearchAreaRef.current = onSearchArea
  }, [onSearchArea])

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInteractingRef = useRef(false)

  // Listen to physical user input on map DOM container
  useEffect(() => {
    const container = map.getContainer()
    if (!container) return

    const onUserActionStart = () => {
      isUserInteractingRef.current = true
    }

    container.addEventListener('mousedown', onUserActionStart)
    container.addEventListener('touchstart', onUserActionStart)
    container.addEventListener('wheel', onUserActionStart, { passive: true })

    return () => {
      container.removeEventListener('mousedown', onUserActionStart)
      container.removeEventListener('touchstart', onUserActionStart)
      container.removeEventListener('wheel', onUserActionStart)
    }
  }, [map])

  // Reset when filters change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    isUserInteractingRef.current = false
  }, [resetRecenterTrigger])

  const scheduleSearch = () => {
    if (!isUserInteractingRef.current) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!onSearchAreaRef.current || !isUserInteractingRef.current) return
      isUserInteractingRef.current = false

      const center = map.getCenter()
      const bounds = map.getBounds()
      const northEast = bounds.getNorthEast()

      // Calculate radius in kilometers from map center to visible corner (clamped 5-20km)
      const distKm = center.distanceTo(northEast) / 1000
      const radius = Math.min(20, Math.max(5, Math.round(distKm)))

      const coords = {
        lat: Number(center.lat.toFixed(5)),
        lng: Number(center.lng.toFixed(5)),
      }

      onSearchAreaRef.current(coords, radius)
    }, 400)
  }

  useMapEvents({
    dragend: () => {
      if (isUserInteractingRef.current) {
        scheduleSearch()
      }
    },
    zoomend: () => {
      if (isUserInteractingRef.current) {
        scheduleSearch()
      }
    },
    moveend: () => {
      if (isUserInteractingRef.current) {
        scheduleSearch()
      }
    },
  })

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return null
}

interface DirectoryMapCoreProps {
  mosques: MosqueView[]
  height?: string
  isLoading?: boolean
  onSearchArea?: (center: { lat: number; lng: number }, radius: number) => void
  resetRecenterTrigger?: number
}

export default function DirectoryMapCore({
  mosques,
  height = '600px',
  isLoading = false,
  onSearchArea,
  resetRecenterTrigger,
}: DirectoryMapCoreProps) {
  // Ensure Leaflet marker asset paths are resolved
  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  // Filter mosques with valid lat/lng coordinates
  const validMosques = mosques.filter(
    (m) =>
      typeof m.lat === 'number' &&
      typeof m.lng === 'number' &&
      !isNaN(m.lat) &&
      !isNaN(m.lng) &&
      m.lat !== 0 &&
      m.lng !== 0
  )

  const defaultCenter: [number, number] =
    validMosques.length > 0 ? [validMosques[0].lat!, validMosques[0].lng!] : [3.1412, 101.6915]

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#D8D2C2] dark:border-[#355443] bg-muted" style={{ height }}>
      {/* Floating Status Pill when loading */}
      {isLoading && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#102319]/95 text-[#1F5A3B] dark:text-[#A3E635] shadow-md border border-[#D8D2C2] dark:border-[#355443] text-xs font-semibold backdrop-blur-xs animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Searching this area...</span>
          </div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter mosques={validMosques} resetRecenterTrigger={resetRecenterTrigger} />

        <MapEventsHandler
          onSearchArea={onSearchArea}
          resetRecenterTrigger={resetRecenterTrigger}
        />

        {validMosques.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat!, m.lng!]}
            icon={createEmeraldPinIcon(m.name || 'Masjid')}
          >
            <Popup className="custom-leaflet-popup">
              <div className="w-56 p-1 space-y-2">
                <div className="relative h-28 w-full rounded-md overflow-hidden bg-muted">
                  <img
                    src={m.image_path || '/placeholder.svg'}
                    alt={m.name || 'Masjid'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#173524] leading-tight">
                    {m.name}
                  </h4>
                  <p className="text-[11px] text-[#5A725F] leading-tight">
                    {formatLocationName(m.city_name)}, {formatLocationName(m.state_name)}
                  </p>
                  <Link
                    href={`/mosque/${m.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1F5A3B] hover:underline pt-1"
                  >
                    <span>View details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
