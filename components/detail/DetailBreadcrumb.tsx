import Link from 'next/link'
import { ChevronRight, ArrowLeft } from 'lucide-react'

interface DetailBreadcrumbProps {
  mosqueName: string | null
}

export default function DetailBreadcrumb({ mosqueName }: DetailBreadcrumbProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-[#5A725F] dark:text-[#B8C8B9]">
      <div className="flex items-center gap-1.5 overflow-hidden">
        <Link
          href="/directory"
          className="hover:text-[#173524] dark:hover:text-[#F7F5EF] transition-colors shrink-0"
        >
          Directory
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#5A725F]/60 dark:text-[#B8C8B9]/60 shrink-0" />
        <span className="font-semibold text-[#173524] dark:text-[#F7F5EF] truncate">
          {mosqueName || 'Masjid Details'}
        </span>
      </div>

      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] px-3 py-1 text-xs font-medium text-[#173524] dark:text-[#F7F5EF] hover:border-[#1F5A3B] dark:hover:border-[#8BC99C] transition-all shadow-xs"
      >
        <ArrowLeft className="h-3 w-3 text-[#1F5A3B] dark:text-[#8BC99C]" />
        Back to Directory
      </Link>
    </div>
  )
}
