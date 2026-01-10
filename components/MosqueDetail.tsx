import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Camera, ArrowLeft } from 'lucide-react'
// import { TikTokEmbed } from 'react-social-media-embed'
import placeholderImg from '../public/placeholder.svg'
import { Mosque } from '@/types/Mosque'
import { getR2ImageUrl } from '@/utils/images'
// import QrCodeDisplay from './qrCodeDisplay'  // Commented out as fields not in new schema
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})


export default function MosqueDetail( { mosque } : { mosque: Mosque }) {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold  mb-2">{mosque.name}</h1>
            <p className="text-muted-foreground mb-4">{mosque.address}</p>

            <div className="relative">
              <div className="lg:grid lg:grid-cols-3 gap-4 mb-4">
                <div className="row-span-2 relative rounded-lg overflow-hidden h-[400px]">
                  <Image
                    src={getR2ImageUrl(mosque.thumbnailUrl) || placeholderImg}
                    alt="Mosque main image"
                    fill
                    objectFit="cover"
                    className="absolute"
                  />
                </div>

                <div className="hidden lg:grid lg:col-span-2 lg:grid-cols-2 lg:gap-4">
                  {mosque.imageUrls?.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-[190px]">
                      <Image src={getR2ImageUrl(url) || placeholderImg} alt={`Mosque image ${index + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              {mosque.imageUrls && mosque.imageUrls.length > 4 && (
                <div className="absolute bottom-0 right-0 m-4">
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" /> View All Photos
                  </Button>
                </div>
              )}
            </div>
            {/* <p className="text-xl font-semibold  mb-2">{mosque.city?.label}, {mosque.state?.label}</p> */}
            <div className="mb-16">
              <Link href={mosque.googleMapsUrl || ''} className="text-[#14532D] underline" target='_blank'>
                Cari di Google Maps
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Lokasi Masjid</h2>
              <LeafletMap
                latitude={mosque.latitude}
                longitude={mosque.longitude}
                googleMapsUrl={mosque.googleMapsUrl}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
              <div className="space-y-2">
                <p>
                  <Phone className="inline-block mr-2" />
                  <a href={`tel:${mosque.phone}`} className="text-primary">
                    {mosque.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 mt-10">
            {/* <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Social Media</h2>
              <div className="flex flex-col items-end space-y-4">
                {Object.entries(mosque.socialMedia).map(([platform, url]) => (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                    <Image src={`/${platform}-icon.svg`} alt={`${platform} icon`} width={24} height={24} />
                  </a>
                ))}
              </div>
            </div> */}

            {/* Donation QR Code section - commented out as fields not in new schema */}
            {/* <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Derma</h2>
              <p className="text-muted-foreground mb-4">Salurkan sumbangan kepada masjid ini melalui  QR akaun masjid yang tertera.</p>
              <div className="border-[1.75px] bg-background p-4 rounded-lg flex justify-center items-center cursor-pointer">
                { mosque.qrContent ? (
                  <div className="flex flex-col items-center gap-2">
                    <QrCodeDisplay
                      qrContent={mosque.qrContent}
                      supportedPayments={mosque.supportedPayments}
                      name='Donation QR Code'
                      size={200}
                    />
                    <p className="text-[8px] sm:text-xs text-zinc-400 text-center">
                      Powered by:{" "}
                      <a
                        href="https://sedekah.je"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SedekahJe
                      </a>
                    </p>
                  </div>
                ) : (
                <Image
                  src={placeholderImg}
                  alt="Donation QR Code"
                  width={250} height={200}
                  className="mx-auto"
                  />
                )}
              </div>
            </div> */}

            {/* <div>
              <h2 className="text-2xl font-bold mb-4">TikTok Review</h2>
              <div className="border rounded-lg overflow-hidden dark:border-border">
                <TikTokEmbed url={mosque.tiktokReview.videoUrl} width="100%" />
                <div className="p-4">
                  <p className="mb-2">{mosque.tiktokReview.caption}</p>
<Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950">
                    Watch Now
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

