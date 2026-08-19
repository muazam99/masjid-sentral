import { Check, PlusCircle, Sparkles } from 'lucide-react'
import { MosqueFacility } from '@/types/Mosque'
import { Button } from '@/components/ui/button'

interface FacilitiesSectionProps {
  facilities: MosqueFacility[]
  onSuggestEdit?: () => void
}

export default function FacilitiesSection({ facilities, onSuggestEdit }: FacilitiesSectionProps) {
  const hasFacilities = facilities && facilities.length > 0

  return (
    <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#173524] dark:text-[#F7F5EF]">
          Facilities & Amenities
        </h2>
        {hasFacilities && (
          <span className="text-xs text-[#5A725F] dark:text-[#B8C8B9] flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#C7A34D]" />
            {facilities.length} kemudahan didaftarkan
          </span>
        )}
      </div>

      {/* Dynamic List or Empty State */}
      {hasFacilities ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 border border-[#D8D2C2]/40 dark:border-[#355443]/40"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/20 text-[#1F5A3B] dark:text-[#8BC99C]">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-semibold text-[#173524] dark:text-[#F7F5EF] capitalize">
                {fac.facility}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center space-y-3 bg-[#F7F5EF]/30 dark:bg-[#0F1F17]/20 rounded-lg border border-dashed border-[#D8D2C2] dark:border-[#355443]">
          <p className="text-sm text-[#5A725F] dark:text-[#B8C8B9]">
            Maklumat kemudahan spesifik belum didaftarkan untuk profil masjid ini.
          </p>
          {onSuggestEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSuggestEdit}
              className="border-[#D8D2C2] dark:border-[#355443] text-xs gap-1.5 font-semibold"
            >
              <PlusCircle className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
              Cadang Kemudahan Masjid Ini
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
