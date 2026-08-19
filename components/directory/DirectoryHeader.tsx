interface DirectoryHeaderProps {
  totalCount: number | null
}

export default function DirectoryHeader({ totalCount }: DirectoryHeaderProps) {
  return (
    <div className="space-y-1.5 pt-2">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#173524] dark:text-[#F7F5EF]">
        Explore Malaysia Mosque Directory
      </h1>
      <p className="text-sm sm:text-base text-[#5A725F] dark:text-[#B8C8B9] font-normal leading-relaxed">
        Canonical registry of masjids, suraus, and musollas across 16 states & federal territories.
      </p>
    </div>
  )
}
