import { Code, Building2, LineChart } from 'lucide-react'

export default function NarrativeSection() {
  const useCases = [
    {
      icon: Code,
      title: 'Developers',
      copy: 'Build maps, mosque finders, check-in tools, and prayer-community apps.',
    },
    {
      icon: Building2,
      title: 'Masjid teams',
      copy: 'Claim, update, and keep public records aligned with real operations.',
    },
    {
      icon: LineChart,
      title: 'Researchers',
      copy: 'Reference cleaner geographic and facility data for civic analysis.',
    },
  ]

  return (
    <section id="narrative" className="bg-[#F7F5EF] dark:bg-[#0F1F17] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D8D2C2] dark:border-[#355443]">
      <div className="mx-auto max-w-[1440px]">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#1F5A3B] dark:text-[#8BC99C] uppercase bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 px-3.5 py-1 rounded-full border border-[#1F5A3B]/20">
            ONE PUBLIC RECORD, MANY USES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173524] dark:text-[#F7F5EF] tracking-tight">
            Stop rebuilding the same mosque directory for every app.
          </h2>
          <p className="text-base sm:text-lg text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
            Masjid Sentral gives developers, mosque committees, and community platforms a shared data foundation: searchable records, submission workflows, verification signals, and API-ready objects from one maintained source.
          </p>
        </div>

        {/* 3 Use Case Persona Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc, i) => {
            const Icon = uc.icon
            return (
              <div
                key={i}
                className="rounded-xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-6 shadow-xs hover:shadow-md transition-all flex flex-col space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 text-[#1F5A3B] dark:text-[#8BC99C]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#173524] dark:text-[#F7F5EF]">{uc.title}</h3>
                  <p className="mt-2 text-sm text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
                    {uc.copy}
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
