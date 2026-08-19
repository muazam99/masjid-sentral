import { Clock, ShieldCheck, Database, Calendar } from 'lucide-react'

interface ContributorsCardProps {
  updatedAt: Date | null
  createdAt?: Date | null
  source: string | null
}

export default function ContributorsCard({
  updatedAt,
  createdAt,
  source,
}: ContributorsCardProps) {
  const updatedDateStr = updatedAt
    ? updatedAt.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  const createdDateStr = createdAt
    ? createdAt.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  const sourceLabel = source
    ? source.charAt(0).toUpperCase() + source.slice(1)
    : 'JejakMasjid & Qiyam Data Pipeline'

  return (
    <div className="rounded-2xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-3">
        <h3 className="text-lg font-bold text-[#173524] dark:text-[#F7F5EF]">
          Data Provenance & Source
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          Verified
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Source Provider */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F7F5EF]/50 dark:bg-[#0F1F17]/40 border border-[#D8D2C2]/40 dark:border-[#355443]/40">
          <Database className="h-4 w-4 text-[#1F5A3B] dark:text-[#8BC99C] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#173524] dark:text-[#F7F5EF] block">
              Primary Source
            </span>
            <span className="text-[#5A725F] dark:text-[#B8C8B9]">
              {sourceLabel}
            </span>
          </div>
        </div>

        {/* Timestamp Records */}
        {createdDateStr && (
          <div className="flex items-center justify-between py-1 border-b border-[#D8D2C2]/40 dark:border-[#355443]/40 text-[#5A725F] dark:text-[#B8C8B9]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
              Pertama kali diindeks
            </span>
            <span className="font-semibold text-[#173524] dark:text-[#F7F5EF]">
              {createdDateStr}
            </span>
          </div>
        )}

        {updatedDateStr && (
          <div className="flex items-center justify-between py-1 text-[#5A725F] dark:text-[#B8C8B9]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
              Kemas kini terakhir
            </span>
            <span className="font-semibold text-[#173524] dark:text-[#F7F5EF]">
              {updatedDateStr}
            </span>
          </div>
        )}
      </div>

      {/* Community Attribution Footer */}
      <div className="pt-2 text-[11px] text-[#5A725F] dark:text-[#B8C8B9] border-t border-[#D8D2C2]/40 dark:border-[#355443]/40 leading-relaxed">
        Profil data dibuka kepada sumbangan komuniti dan disemak secara berkala melalui platform Masjid Sentral.
      </div>
    </div>
  )
}
