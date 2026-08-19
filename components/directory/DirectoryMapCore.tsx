'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Route, ArrowRight } from 'lucide-react'
import { MosqueView } from '@/types/Mosque'
import { formatLocationName } from '@/lib/api'
import placeholderImg from '@/public/placeholder.svg'

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
    " title="${name}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

// Map View Recenter Controller Component
function MapRecenter({ mosques }: { mosques: MosqueView[] }) {
  const map = useMap()

  useEffect(() => {
    const validCoords = mosques
      .filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number' && m.lat !== 0 && m.lng !== 0)
      .map((m) => [m.lat!, m.lng!] as [number, number])

    if (validCoords.length === 1) {
      map.setView(validCoords[0], 14, { animate: true })
    } else if (validCoords.length > 1) {
      const bounds = L.latLngBounds(validCoords)
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true })
    }
  }, [mosques, map])

  return null
}

interface DirectoryMapCoreProps {
  mosques: MosqueView[]
  height?: string
}

export default function DirectoryMapCore({ mosques, height = '600px' }: DirectoryMapCoreProps) {
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
    (m) => typeof m.lat === 'number' && typeof m.lng === 'number' && m.lat !== 0 && m.lng !== 0
  )

  const defaultCenter: [number, number] =
    validMosques.length > 0 ? [validMosques[0].lat!, validMosques[0].lng!] : [3.1412, 101.6915]

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#D8D2C2] dark:border-[#355443] bg-muted" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter mosques={validMosques} />

        {validMosques.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat!, m.lng!]}
            icon={createEmeraldPinIcon(m.name || 'Masjid')}
          >
            <Popup className="custom-leaflet-popup">
              <div className="w-56 p-1 space-y-2">
                <div className="relative h-28 w-full rounded-md overflow-hidden bg-muted">
                  <Image
                    src={m.image_path || placeholderImg}
                    alt={m.name || 'Masjid'}
                    fill
                    className="object-cover"
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

      {validMosques.length === 0 && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 text-center z-[1000]">
          <p className="text-xs font-medium text-muted-foreground">
            No geographic coordinates available for current mosques.
          </p>
        </div>
      )}
    </div>
  )
}
