import { Mosque } from '@/types/Mosque'
import SedekahQrCard from './SedekahQrCard'
import SocialMediaCard from './SocialMediaCard'
import ContributorsCard from './ContributorsCard'

interface DetailSidebarProps {
  mosque: Mosque
  onSuggestEdit?: () => void
}

export default function DetailSidebar({ mosque, onSuggestEdit }: DetailSidebarProps) {
  // Find official QR contact if exists in DB
  const qrContact = mosque.contacts?.find(
    (c) => c.type === 'duitnow_qr' || c.type === 'qr' || c.type === 'qr_code'
  )?.value

  return (
    <div className="space-y-6 sticky top-20">
      {/* 1. Sedekah QR Card */}
      <SedekahQrCard
        mosqueName={mosque.name}
        qrContent={qrContact}
        onSuggestQr={onSuggestEdit}
      />

      {/* 2. Social Media Links Card */}
      <SocialMediaCard
        contacts={mosque.contacts}
        websiteUrl={mosque.websiteUrl}
        mosqueName={mosque.name}
        onSuggestLinks={onSuggestEdit}
      />

      {/* 3. Contributors & Verification Card */}
      <ContributorsCard
        updatedAt={mosque.updatedAt}
        createdAt={mosque.createdAt}
        source={mosque.category}
      />
    </div>
  )
}
