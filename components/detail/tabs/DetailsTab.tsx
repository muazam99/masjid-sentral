import { Mosque } from '@/types/Mosque'
import AboutSection from './AboutSection'
import FacilitiesSection from './FacilitiesSection'
import LocationSection from './LocationSection'
import PrayerTimesSection from './PrayerTimesSection'

interface DetailsTabProps {
  mosque: Mosque
  onSuggestEdit?: () => void
}

export default function DetailsTab({ mosque, onSuggestEdit }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. About Section */}
      <AboutSection
        description={mosque.description}
        category={mosque.category}
        jumaatAvailable={mosque.jumaatAvailable}
        mosqueName={mosque.name}
        cityName={mosque.cityName}
        stateName={mosque.stateName}
      />

      {/* 2. Facilities Section */}
      <FacilitiesSection
        facilities={mosque.facilities}
        onSuggestEdit={onSuggestEdit}
      />

      {/* 3. Location Section with Leaflet Map */}
      <LocationSection
        latitude={mosque.latitude}
        longitude={mosque.longitude}
        address={mosque.address}
        googleMapsUrl={mosque.googleMapsUrl}
        mosqueName={mosque.name}
      />

      {/* 4. Prayer Times Section */}
      <PrayerTimesSection
        latitude={mosque.latitude}
        longitude={mosque.longitude}
        cityName={mosque.cityName}
        stateName={mosque.stateName}
      />
    </div>
  )
}
