'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
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

// Custom User Location Pin Icon (Blue pulsating radar beacon)
const createUserLocationIcon = () =>
  L.divIcon({
    className: 'user-location-pin',
    html: `<div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: rgba(37, 99, 235, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background-color: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })

// Custom Emerald Masjid Pin Icon
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
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5a.75.75 0 0 1 .75.75v.5a4.5 4.5 0 0 1 3.75 4.45v1.3h1.75a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75v-9.5a.75.75 0 0 1 .75-.75h1.75v-1.3A4.5 4.5 0 0 1 11.25 3.75v-.5a.75.75 0 0 1 .75-.75Zm-2 16.5h4v-3a2 2 0 1 0-4 0v3Zm-4.25 0h2.75v-3a3.5 3.5 0 1 1 7 0v3h2.75V11H5.75v8Zm1.75-9.5h9V8.2a3 3 0 0 0-3-3 3 3 0 0 0-3 3v1.3Z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

// Custom Emerald Cluster Icon — count badge for overlapping masjid pins
const createClusterIcon = (cluster: { getChildCount: () => number }) => {
  const count = cluster.getChildCount()
  const size = count < 10 ? 36 : count < 100 ? 44 : 52
  return L.divIcon({
    className: 'custom-emerald-cluster',
    html: `<div style="
      background-color: #1F5A3B;
      color: #FFFFFF;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: ${count < 100 ? '13px' : '11px'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      border: 3px solid #FFFFFF;
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Map View Recenter Controller Component
function MapRecenter({
  mosques,
  resetRecenterTrigger,
  userLocation,
  locateTrigger,
}: {
  mosques: MosqueView[]
  resetRecenterTrigger?: number
  userLocation?: { lat: number; lng: number } | null
  locateTrigger?: number
}) {
  const map = useMap()
  const initialFitDone = useRef(false)
  const lastTrigger = useRef<number | undefined>(resetRecenterTrigger)
  const lastLocateTrigger = useRef<number | undefined>(locateTrigger)
  // Consumed only once a fitBounds/setView with valid coords actually happens —
  // keeps a search/state-filter trigger "pending" across the async gap between
  // the trigger firing and the new mosques list arriving (Pitfall: race condition)
  const pendingBoundsFit = useRef(false)

  // Any explicit "locate me" click should always recenter on the user, even if
  // the coordinates are identical to the last known location (still outside view)
  useEffect(() => {
    const locateTriggerFired = locateTrigger !== undefined && locateTrigger !== lastLocateTrigger.current
    if (locateTriggerFired && userLocation) {
      lastLocateTrigger.current = locateTrigger
      map.setView([userLocation.lat, userLocation.lng], 14, { animate: true })
    }
  }, [locateTrigger, userLocation, map])

  // Mark a bounds-fit as pending whenever the search/filter trigger changes
  useEffect(() => {
    if (resetRecenterTrigger !== undefined && resetRecenterTrigger !== lastTrigger.current) {
      lastTrigger.current = resetRecenterTrigger
      pendingBoundsFit.current = true
    }
  }, [resetRecenterTrigger])

  // Perform the actual fitBounds once mosques for the pending trigger have arrived
  useEffect(() => {
    const shouldRecenter = pendingBoundsFit.current || !initialFitDone.current

    if (!shouldRecenter) return

    const validCoords = mosques
      .filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number' && !isNaN(m.lat) && !isNaN(m.lng) && m.lat !== 0 && m.lng !== 0)
      .map((m) => [m.lat!, m.lng!] as [number, number])

    if (validCoords.length === 0) return

    initialFitDone.current = true
    pendingBoundsFit.current = false

    if (validCoords.length === 1) {
      map.setView(validCoords[0], 14, { animate: true })
    } else {
      const bounds = L.latLngBounds(validCoords)
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true })
    }
  }, [mosques, map])

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
  userLocation?: { lat: number; lng: number } | null
  locateTrigger?: number
}

export default function DirectoryMapCore({
  mosques,
  height = '600px',
  isLoading = false,
  onSearchArea,
  resetRecenterTrigger,
  userLocation,
  locateTrigger,
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

  // Filter mosques with valid lat/lng coordinates — memoized so MapRecenter only
  // sees a new reference when `mosques` itself changes, not on every render
  const validMosques = useMemo(
    () =>
      mosques.filter(
        (m) =>
          typeof m.lat === 'number' &&
          typeof m.lng === 'number' &&
          !isNaN(m.lat) &&
          !isNaN(m.lng) &&
          m.lat !== 0 &&
          m.lng !== 0
      ),
    [mosques]
  )

  const defaultCenter: [number, number] =
    userLocation
      ? [userLocation.lat, userLocation.lng]
      : validMosques.length > 0
      ? [validMosques[0].lat!, validMosques[0].lng!]
      : [3.1412, 101.6915]

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
        zoom={userLocation ? 14 : 12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter
          mosques={validMosques}
          resetRecenterTrigger={resetRecenterTrigger}
          userLocation={userLocation}
          locateTrigger={locateTrigger}
        />

        <MapEventsHandler
          onSearchArea={onSearchArea}
          resetRecenterTrigger={resetRecenterTrigger}
        />

        {/* User Current Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon()}
            zIndexOffset={1000}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 text-center">
                <p className="text-xs font-bold text-[#173524] flex items-center justify-center gap-1">
                  <span>📍</span>
                  <span>Your Current Location</span>
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        <MarkerClusterGroup
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
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
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
