'use client'

import { useState, useEffect } from 'react'
import { Mosque } from '@/types/Mosque'
import { calculateDistanceKm, formatDistance } from '@/lib/api'
import DetailBreadcrumb from './detail/DetailBreadcrumb'
import DetailPhotoGallery from './detail/DetailPhotoGallery'
import DetailIdentityHeader from './detail/DetailIdentityHeader'
import DetailTabs, { DetailTabType } from './detail/DetailTabs'
import DetailsTab from './detail/tabs/DetailsTab'
import EventsTab from './detail/tabs/EventsTab'
import ReviewsTab from './detail/tabs/ReviewsTab'
import ContactsTab from './detail/tabs/ContactsTab'
import DetailSidebar from './detail/sidebar/DetailSidebar'

interface MosqueDetailProps {
  mosque: Mosque
}

export default function MosqueDetail({ mosque }: MosqueDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTabType>('details')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Request user location for distance calculation
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          // Ignored if denied
        },
        { timeout: 5000 }
      )
    }
  }, [])

  // Calculate distance if coordinates available
  const distanceStr =
    userLocation && mosque.latitude && mosque.longitude
      ? formatDistance(
          calculateDistanceKm(
            userLocation.lat,
            userLocation.lng,
            mosque.latitude,
            mosque.longitude
          )
        )
      : null

  return (
    <div className="bg-[#F7F5EF] dark:bg-[#0F1F17] text-[#173524] dark:text-[#F7F5EF] min-h-screen transition-colors pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* 1. Breadcrumb */}
        <DetailBreadcrumb mosqueName={mosque.name} />

        {/* 2. Asymmetric 3-Photo Hero Gallery */}
        <DetailPhotoGallery
          images={mosque.imageUrls}
          thumbnailUrl={mosque.thumbnailUrl}
          mosqueName={mosque.name}
        />

        {/* 3. Identity Header & Actions */}
        <DetailIdentityHeader
          mosqueId={mosque.id}
          mosqueName={mosque.name}
          address={mosque.address}
          stateName={mosque.stateName}
          cityName={mosque.cityName}
          latitude={mosque.latitude}
          longitude={mosque.longitude}
          googleMapsUrl={mosque.googleMapsUrl}
          distanceStr={distanceStr}
        />

        {/* 4. Tab Navigation Strip */}
        <DetailTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          eventsCount={mosque.events?.length || 0}
          reviewsCount={mosque.reviewCount || 0}
        />

        {/* 5. Two-Column Layout (Main Content + Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (~65-70% width on Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'details' && (
              <DetailsTab mosque={mosque} />
            )}
            {activeTab === 'events' && (
              <EventsTab events={mosque.events} />
            )}
            {activeTab === 'reviews' && (
              <ReviewsTab
                reviews={mosque.reviews}
                avgRating={mosque.avgRating}
                reviewCount={mosque.reviewCount}
                reviewsPerRating={mosque.reviewsPerRating}
                mosqueName={mosque.name}
              />
            )}
            {activeTab === 'contacts' && (
              <ContactsTab
                phone={mosque.phone}
                email={mosque.email}
                websiteUrl={mosque.websiteUrl}
                googleMapsUrl={mosque.googleMapsUrl}
                address={mosque.address}
                contacts={mosque.contacts}
                mosqueName={mosque.name}
                stateName={mosque.stateName}
              />
            )}
          </div>

          {/* Sticky Sidebar (~30-35% width on Desktop) */}
          <div className="lg:col-span-4">
            <DetailSidebar mosque={mosque} />
          </div>

        </div>

      </div>
    </div>
  )
}

