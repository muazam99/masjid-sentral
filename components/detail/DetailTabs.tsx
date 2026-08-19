'use client'

export type DetailTabType = 'details' | 'events' | 'reviews' | 'contacts'

interface DetailTabsProps {
  activeTab: DetailTabType
  onChange: (tab: DetailTabType) => void
  eventsCount?: number
  reviewsCount?: number
}

export default function DetailTabs({
  activeTab,
  onChange,
  eventsCount = 0,
  reviewsCount = 0,
}: DetailTabsProps) {
  const tabs: Array<{ id: DetailTabType; label: string; count?: number }> = [
    { id: 'details', label: 'Details' },
    { id: 'events', label: 'Events', count: eventsCount },
    { id: 'reviews', label: 'Reviews', count: reviewsCount },
    { id: 'contacts', label: 'Contacts' },
  ]

  return (
    <div className="border-b border-[#D8D2C2] dark:border-[#355443] mt-2 mb-6">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative py-3.5 text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'text-[#1F5A3B] dark:text-[#8BC99C]'
                  : 'text-[#5A725F] dark:text-[#B8C8B9] hover:text-[#173524] dark:hover:text-[#F7F5EF]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? 'bg-[#1F5A3B]/10 dark:bg-[#8BC99C]/20 text-[#1F5A3B] dark:text-[#8BC99C]'
                      : 'bg-[#ECE7DA] dark:bg-[#203829] text-[#5A725F] dark:text-[#B8C8B9]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1F5A3B] dark:bg-[#8BC99C] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
