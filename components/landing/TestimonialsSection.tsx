import { MapPinned, MoonStar, BadgeCheck } from 'lucide-react'

export default function TestimonialsSection() {
  return (
    <section className="bg-[#F7F5EF] dark:bg-[#0F1F17] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D8D2C2] dark:border-[#355443]">
      <div className="mx-auto max-w-[1440px]">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#1F5A3B] dark:text-[#8BC99C] uppercase bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 px-3.5 py-1 rounded-full border border-[#1F5A3B]/20">
            TRUSTED BY APPS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#173524] dark:text-[#F7F5EF] tracking-tight">
            Built into products serving masjid communities.
          </h2>
          <p className="text-base text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
            Early apps use Masjid Sentral as shared infrastructure for cleaner masjid profiles, location data, and community-facing discovery experiences.
          </p>
        </div>

        {/* 2 Featured Testimonial Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Jejak Masjid Card */}
          <div className="rounded-2xl bg-[#102319] text-white p-8 shadow-xl border border-[#355443] flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F5A3B] text-white shadow-md border border-[#355443]">
                  <MapPinned className="h-6 w-6 text-[#E7C66A]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white">Jejak Masjid</h3>
                  <p className="text-xs text-[#DDE9DE] font-medium">Directory & discovery app</p>
                </div>
              </div>
              <blockquote className="text-lg font-semibold text-white leading-relaxed italic">
                &ldquo;A cleaner base layer for mosque profiles, location records, and public directory experiences across Malaysian communities.&rdquo;
              </blockquote>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#DDE9DE] pt-4 border-t border-[#355443]">
              <BadgeCheck className="h-4 w-4 text-[#8BC99C]" />
              <span>Early ecosystem app (jejakmasjid.my)</span>
            </div>
          </div>

          {/* Qiyam Card */}
          <div className="rounded-2xl bg-white dark:bg-[#172D20] text-[#173524] dark:text-[#F7F5EF] p-8 shadow-md border border-[#D8D2C2] dark:border-[#355443] flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7A34D]/20 dark:bg-[#E7C66A]/20 text-[#C7A34D] dark:text-[#E7C66A] shadow-xs">
                  <MoonStar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-[#173524] dark:text-[#F7F5EF]">Qiyam</h3>
                  <p className="text-xs text-[#5A725F] dark:text-[#B8C8B9] font-medium">Prayer night companion</p>
                </div>
              </div>
              <blockquote className="text-lg font-semibold text-[#173524] dark:text-[#F7F5EF] leading-relaxed italic">
                &ldquo;A dependable masjid identity source for building prayer-night flows, venue discovery, and community schedules without rebuilding the directory.&rdquo;
              </blockquote>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#5A725F] dark:text-[#B8C8B9] pt-4 border-t border-[#D8D2C2] dark:border-[#355443]">
              <BadgeCheck className="h-4 w-4 text-[#1F5A3B] dark:text-[#8BC99C]" />
              <span>Early ecosystem app (qiyam.com.my)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
