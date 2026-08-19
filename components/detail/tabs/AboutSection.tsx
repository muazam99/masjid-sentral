import { Landmark, Users, CheckCircle2, XCircle } from 'lucide-react'

interface AboutSectionProps {
  description: string | null
  category: string | null
  jumaatAvailable: boolean
  mosqueName: string | null
  cityName: string | null
  stateName: string | null
}

export default function AboutSection({
  description,
  category,
  jumaatAvailable,
  mosqueName,
  cityName,
  stateName,
}: AboutSectionProps) {
  const categoryLabel =
    category === 'surau'
      ? 'Surau'
      : category === 'musolla'
      ? 'Musolla'
      : 'Mosque'

  const locationContext = cityName ? `${cityName}, ${stateName}` : stateName || 'Malaysia'
  const defaultDesc = `${mosqueName || 'This masjid'} is an active community Islamic center located in ${locationContext}. This profile keeps visitor-facing information in one place: location context, facilities, prayer times, social links, and community contribution channels.`

  return (
    <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#173524] dark:text-[#F7F5EF]">
          About
        </h2>
        <span className="text-xs text-[#5A725F] dark:text-[#B8C8B9] flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#8BC99C]" />
          Profile maintained by community contributors
        </span>
      </div>

      {/* Narrative */}
      <p className="text-sm sm:text-base leading-relaxed text-[#5A725F] dark:text-[#B8C8B9]">
        {description && description.trim().length > 0 ? description : defaultDesc}
      </p>

      {/* Stats Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {/* Category Stat */}
        <div className="rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF]/60 dark:bg-[#0F1F17]/60 p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#5A725F] dark:text-[#B8C8B9] uppercase tracking-wider">
            Category
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Landmark className="h-4 w-4 text-[#1F5A3B] dark:text-[#8BC99C]" />
            <span className="text-sm font-bold text-[#173524] dark:text-[#F7F5EF]">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Jumaat Available */}
        <div className="rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF]/60 dark:bg-[#0F1F17]/60 p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#5A725F] dark:text-[#B8C8B9] uppercase tracking-wider">
            Jumaat Available
          </span>
          <div className="mt-1">
            {jumaatAvailable ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 shadow-xs">
                <CheckCircle2 className="h-3 w-3" /> Yes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5">
                <XCircle className="h-3 w-3" /> No (Daily Prayers Only)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
