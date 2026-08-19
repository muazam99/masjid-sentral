import { Star } from 'lucide-react'

interface ReviewsOverviewCardProps {
  avgRating: number | null
  reviewCount: number
  reviewsPerRating: Record<number, number> | null
}

export default function ReviewsOverviewCard({
  avgRating,
  reviewCount,
  reviewsPerRating,
}: ReviewsOverviewCardProps) {
  const displayScore = avgRating ? avgRating.toFixed(1) : '-'
  const dist = reviewsPerRating || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const totalCount = reviewCount || 0

  return (
    <div className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Score Summary Column */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#D8D2C2]/60 dark:border-[#355443]/60 pb-4 md:pb-0 md:pr-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A725F] dark:text-[#B8C8B9]">
            Penilaian Keseluruhan
          </span>
          
          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-black text-[#173524] dark:text-[#F7F5EF] tracking-tight">
              {displayScore}
            </span>
            {avgRating ? (
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
              </div>
            ) : null}
          </div>

          <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9]">
            {totalCount > 0
              ? `Berdasarkan ${totalCount} ulasan komuniti & jemaah`
              : 'Belum ada penilaian komuniti'}
          </p>
        </div>

        {/* Distribution Progress Bars */}
        <div className="md:col-span-7 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = dist[stars] || 0
            const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
            return (
              <div key={stars} className="flex items-center gap-3 text-xs font-semibold">
                <span className="w-3 text-right text-[#173524] dark:text-[#F7F5EF] shrink-0">
                  {stars}
                </span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="h-2.5 flex-1 rounded-full bg-[#ECE7DA] dark:bg-[#0F1F17] overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full rounded-full bg-[#1F5A3B] dark:bg-[#8BC99C] transition-all duration-500"
                  />
                </div>
                <span className="w-8 text-right text-[#5A725F] dark:text-[#B8C8B9] shrink-0">
                  {count}
                </span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
