import { CheckCircle2, Code2, Users, MapPin } from 'lucide-react'

export default function TrustStrip() {
  const pillars = [
    {
      icon: CheckCircle2,
      title: 'Verified records',
      copy: 'Reviewed public profiles with clear source status.',
    },
    {
      icon: Code2,
      title: 'Open API',
      copy: 'Stable endpoints for maps, apps, and civic tools.',
    },
    {
      icon: Users,
      title: 'Community updates',
      copy: 'Structured submissions for new and corrected records.',
    },
    {
      icon: MapPin,
      title: 'Location ready',
      copy: 'Coordinates, address fields, states, and searchable IDs.',
    },
  ]

  return (
    <section className="border-b border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 text-[#1F5A3B] dark:text-[#8BC99C] transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#173524] dark:text-[#F7F5EF] tracking-tight">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
                    {item.copy}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
