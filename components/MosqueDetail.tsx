import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Camera } from 'lucide-react'
// import { TikTokEmbed } from 'react-social-media-embed'
import placeholderImg from '../public/placeholder.svg'
import { Mosque } from '@/types/Mosque'


export default function MosqueDetail( { mosque } : { mosque: Mosque }) {
  console.log(mosque)
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold  mb-2">{mosque.name}</h1>
            <p className="text-muted-foreground  mb-2">{mosque.state?.label}, {mosque.city?.label}</p>
            <div className="mb-4">
              <Link href={mosque.googleMapsUrl || ''} className="text-primary underline" target='_blank'>
                Cari di Google Maps
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {mosque.image_urls?.map((image, index) => (
                <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                  <Image src={image} alt={`Mosque image ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
           
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image 
                    src={mosque.thumbnailUrl || placeholderImg} 
                    alt={`Mosque image`}
                    fill
                    className="object-cover" 
                  />
                </div>
            </div>
            <div className="text-center mb-8">
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" /> View All Photos
              </Button>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Lokasi Masjid</h2>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <iframe
                  src={mosque.googleMapsEmbedded || ''}
                  width="100%"
                  height="80%"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
              <div className="space-y-2">
                <p>
                  <Phone className="inline-block mr-2" />
                  <a href={`tel:${mosque.contactNo}`} className="text-primary">
                    {mosque.contactNo}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Social Media</h2>
              <div className="flex flex-col items-end space-y-4">
                {/* {Object.entries(mosque.socialMedia).map(([platform, url]) => (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                    <Image src={`/${platform}-icon.svg`} alt={`${platform} icon`} width={24} height={24} />
                  </a>
                ))} */}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Derma</h2>
              <p className="mb-4">Support our mosque by making a donation.</p>
              <div className="border-2 border-pink-500 p-4 rounded-lg">
                <Image src={placeholderImg} alt="Donation QR Code" width={200} height={200} className="mx-auto" />
              </div>
            </div>

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

