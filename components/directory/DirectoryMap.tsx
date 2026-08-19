'use client'

import dynamic from 'next/dynamic'
import { MosqueView } from '@/types/Mosque'

const DirectoryMapCore = dynamic(() => import('./DirectoryMapCore'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-2xl border border-border bg-muted flex items-center justify-center">
      <p className="text-sm font-medium text-muted-foreground">Loading interactive map...</p>
    </div>
  ),
})

interface DirectoryMapProps {
  mosques: MosqueView[]
  height?: string
}

export default function DirectoryMap({ mosques, height = '600px' }: DirectoryMapProps) {
  return <DirectoryMapCore mosques={mosques} height={height} />
}
