import { FilePlus, ShieldCheck, Globe2 } from 'lucide-react'

export default function SubmissionFlowSection() {
  const steps = [
    {
      num: '01',
      icon: FilePlus,
      title: 'Submit',
      copy: 'Add a new masjid or correct existing details.',
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'Review',
      copy: 'Moderators compare source fields and duplicate records.',
    },
    {
      num: '03',
      icon: Globe2,
      title: 'Publish',
      copy: 'Verified data becomes searchable and API-ready.',
    },
  ]

  return (
    <section id="submission-flow" className="bg-[#F7F5EF] dark:bg-[#0F1F17] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D8D2C2] dark:border-[#355443]">
      <div className="mx-auto max-w-[1440px]">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#1F5A3B] dark:text-[#8BC99C] uppercase bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 px-3.5 py-1 rounded-full border border-[#1F5A3B]/20">
            COMMUNITY SUBMISSIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#173524] dark:text-[#F7F5EF] tracking-tight">
            A cleaner way to improve the public record.
          </h2>
          <p className="text-base text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
            Every correction is structured, reviewable, and publishable.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#C7A34D] dark:text-[#E7C66A] tracking-tighter">
                    {step.num}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/15 text-[#1F5A3B] dark:text-[#8BC99C] transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-[#173524] dark:text-[#F7F5EF]">{step.title}</h3>
                  <p className="text-sm text-[#5A725F] dark:text-[#B8C8B9] leading-relaxed">
                    {step.copy}
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
