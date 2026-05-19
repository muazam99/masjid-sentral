'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js / bundlers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletMapProps {
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl?: string | null;
  height?: string;
}

export default function LeafletMap({ latitude, longitude, googleMapsUrl, height = '400px' }: LeafletMapProps) {
  // Ensure Leaflet CSS is loaded (fixes potential SSR issues)
  useEffect(() => {
    import('leaflet/dist/leaflet.css');
  }, []);

  if (latitude === null || longitude === null) {
    return (
      <div
        className="rounded-lg overflow-hidden border border-border flex items-center justify-center bg-muted"
        style={{ height }}
      >
        <p className="text-muted-foreground">Location data not available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {googleMapsUrl && (
            <Popup>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Open in Google Maps
              </a>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
