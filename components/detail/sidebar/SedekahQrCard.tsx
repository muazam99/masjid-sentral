'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Heart, QrCode, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SedekahQrCardProps {
  mosqueName: string | null
  qrContent?: string | null
  onSuggestQr?: () => void
}

export default function SedekahQrCard({
  mosqueName,
  qrContent,
  onSuggestQr,
}: SedekahQrCardProps) {
  const hasQr = Boolean(qrContent && qrContent.trim().length > 0)

  return (
    <div className="rounded-2xl border border-[#355443] bg-[#102319] text-white p-6 shadow-md space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[#E7C66A]">
          <Heart className="h-4 w-4 fill-[#E7C66A]" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Infaq & Sedekah
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-white tracking-tight">
          Sedekah to this masjid
        </h3>
        <p className="text-xs text-[#DDE9DE] leading-relaxed">
          {hasQr
            ? `Imbas kod QR rasmi untuk menyalurkan sumbangan terus ke akaun ${mosqueName}.`
            : `Kod QR rasmi belum didaftarkan untuk ${mosqueName}.`}
        </p>
      </div>

      {/* QR Code Container or Empty State */}
      {hasQr ? (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner mx-auto max-w-[220px]">
          <QRCodeSVG
            value={qrContent!}
            size={160}
            level="M"
            includeMargin={false}
            className="rounded-sm"
          />
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#102319]">
            <QrCode className="h-3 w-3 text-[#1F5A3B]" />
            <span>DuitNow QR Rasmi</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-white/10 text-center space-y-3">
          <QrCode className="h-10 w-10 text-[#E7C66A]/60" />
          <p className="text-xs text-[#DDE9DE]">
            Bantu jemaah lain dengan memuat naik atau mencadangkan kod QR DuitNow masjid ini.
          </p>
          {onSuggestQr && (
            <Button
              size="sm"
              onClick={onSuggestQr}
              className="bg-[#C7A34D] hover:bg-[#E7C66A] text-[#102319] text-xs font-bold gap-1.5 border-none shadow-xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Hantar QR Masjid Ini
            </Button>
          )}
        </div>
      )}

      {hasQr && (
        <p className="text-center text-[11px] font-bold text-[#C7A34D]">
          DuitNow QR · {mosqueName}
        </p>
      )}
    </div>
  )
}
