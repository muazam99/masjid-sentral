import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface MosqueCardProps {
  id: number
  name: string
  cityName: string
  stateName: string
  imageUrl: string
}

import placeholderImg from '../public/placeholder.svg'

export default function MosqueCard({ id, name, cityName, stateName, imageUrl }: MosqueCardProps) {
  return (
    <Link href={`/mosque/${id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg dark:bg-card dark:text-card-foreground">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl || placeholderImg}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 min-h-[2rem]">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{cityName}, {stateName}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

