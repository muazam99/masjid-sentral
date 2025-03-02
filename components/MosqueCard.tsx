import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface MosqueCardProps {
  id: number
  name: string
  location: string
  imageUrl: string
}

import placeholderImg from '../public/placeholder.svg'

export default function MosqueCard({ id, name, location, imageUrl }: MosqueCardProps) {
  return (
    <Link href={`/mosque/${id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md dark:bg-card dark:text-card-foreground">
        <div className="aspect-video relative">
          <Image
            src={ placeholderImg}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

