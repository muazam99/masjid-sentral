'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import placeholderImg from '@/public/placeholder.svg'

interface DetailPhotoGalleryProps {
  images: string[] | null
  thumbnailUrl: string | null
  mosqueName: string | null
}

export default function DetailPhotoGallery({
  images,
  thumbnailUrl,
  mosqueName,
}: DetailPhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Consolidate unique image list
  const photoList: string[] = []
  if (thumbnailUrl) photoList.push(thumbnailUrl)
  if (images && images.length > 0) {
    for (const img of images) {
      if (!photoList.includes(img)) {
        photoList.push(img)
      }
    }
  }

  const hasPhotos = photoList.length > 0
  const primaryPhoto = hasPhotos ? photoList[0] : null
  const secondaryPhoto1 = photoList.length > 1 ? photoList[1] : null
  const secondaryPhoto2 = photoList.length > 2 ? photoList[2] : null

  const openLightbox = (index: number) => {
    if (hasPhotos) setLightboxIndex(index)
  }

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photoList.length)
    }
  }

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photoList.length) % photoList.length)
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#D8D2C2] dark:border-[#355443] bg-muted shadow-sm">
      {/* 3-Photo Grid for Desktop, Single/Swipe for Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[260px] sm:h-[340px] md:h-[380px]">
        
        {/* Main Photo (8 cols or 12 if only 1 photo) */}
        <div
          onClick={() => openLightbox(0)}
          className={`relative h-full w-full bg-[#172D20]/10 overflow-hidden cursor-pointer group ${
            photoList.length > 1 ? 'md:col-span-8' : 'md:col-span-12'
          }`}
        >
          <Image
            src={primaryPhoto || placeholderImg}
            alt={mosqueName || 'Mosque main photo'}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
        </div>

        {/* Secondary Stacked Photos (4 cols) */}
        {photoList.length > 1 && (
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-2 h-full">
            {/* Top secondary */}
            <div
              onClick={() => openLightbox(1)}
              className="relative h-full w-full bg-[#172D20]/10 overflow-hidden cursor-pointer group rounded-sm"
            >
              <Image
                src={secondaryPhoto1 || placeholderImg}
                alt={`${mosqueName} photo 2`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Bottom secondary */}
            <div
              onClick={() => openLightbox(2 % photoList.length)}
              className="relative h-full w-full bg-[#172D20]/10 overflow-hidden cursor-pointer group rounded-sm"
            >
              <Image
                src={secondaryPhoto2 || secondaryPhoto1 || placeholderImg}
                alt={`${mosqueName} photo 3`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          </div>
        )}
      </div>

      {/* Photo Count Badge (Bottom Right) */}
      <button
        onClick={() => openLightbox(0)}
        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#102319]/80 hover:bg-[#102319] text-white text-xs font-semibold px-3 py-1.5 backdrop-blur-md border border-white/20 shadow-md transition-transform hover:scale-105 cursor-pointer"
      >
        <Camera className="h-3.5 w-3.5 text-[#E7C66A]" />
        <span>{photoList.length > 0 ? `${photoList.length} photos` : 'No photos'}</span>
      </button>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && hasPhotos && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
          >
            <Image
              src={photoList[lightboxIndex]}
              alt={`${mosqueName} photo ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />

            {/* Navigation Arrows */}
            {photoList.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-transform hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-transform hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-2 inset-x-0 text-center text-xs text-white/80">
              {lightboxIndex + 1} / {photoList.length} · {mosqueName}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
