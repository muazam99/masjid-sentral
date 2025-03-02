import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {  Phone, Mail, Camera } from 'lucide-react'
// import { TikTokEmbed } from 'react-social-media-embed'
import placeholderImg from '../public/placeholder.svg'

interface MosqueDetailProps {
  mosque: {
    name: string
    location: string
    images: string[]
    activities: Array<{ speaker: string; title: string; description: string }>
    contact: {
      phone1: string
      phone2: string
      email: string
    }
    socialMedia: {
      tiktok: string
      instagram: string
      facebook: string
      twitter: string
      whatsapp: string
    }
    tiktokReview: {
      videoUrl: string
      caption: string
    }
  }
}

export default function MosqueDetail({ mosque }: MosqueDetailProps) {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold  mb-2">{mosque.name}</h1>
            <p className="text-muted-foreground  mb-2">{mosque.location}</p>
            <div className="mb-4">
              <Link href="#" className="text-primary underline">
                Cari di Google Maps
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {mosque.images.map((image, index) => (
                <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                  <Image src={placeholderImg} alt={`Mosque image ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="text-center mb-8">
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" /> View All Photos
              </Button>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Papan Kenyataan</h2>
                <Button>Tambah Aktiviti</Button>
              </div>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {mosque.activities.map((activity, index) => (
                  <Card key={index} className="w-64 flex-shrink-0 dark:bg-card dark:text-card-foreground">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-muted rounded-lg mb-2"></div>
                      <h3 className="font-bold">{activity.speaker}</h3>
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-right">
                <Link href="#" className="text-primary">
                  Lihat Semua
                </Link>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Lokasi Masjid</h2>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image src="/placeholder.svg?height=400&width=600" alt="Mosque location map" fill className="object-cover" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
              <div className="space-y-2">
                <p>
                  <Phone className="inline-block mr-2" />
                  <a href={`tel:${mosque.contact.phone1}`} className="text-primary">
                    {mosque.contact.phone1}
                  </a>
                </p>
                <p>
                  <Phone className="inline-block mr-2" />
                  <a href={`tel:${mosque.contact.phone2}`} className="text-primary">
                    {mosque.contact.phone2}
                  </a>
                </p>
                <p>
                  <Mail className="inline-block mr-2" />
                  <a href={`mailto:${mosque.contact.email}`} className="text-primary">
                    {mosque.contact.email}
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

