'use client'

import { LayoutGrid, List, Map } from 'lucide-react'

interface DirectoryToolbarProps {
  count: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  showMap?: boolean
  onToggleShowMap?: () => void
}

export default function DirectoryToolbar({
  count,
  viewMode,
  onViewModeChange,
  showMap = true,
  onToggleShowMap,
}: DirectoryToolbarProps) {
  return (
    <div className="flex h-[42px] w-full items-center justify-between">

      {/* Left: Results Count (Pencil eH7oX spec) */}
      <h2 className="text-lg font-black text-[#173524] dark:text-[#F7F5EF] tracking-tight">
        {count.toLocaleString()} {count === 1 ? 'masjid' : 'masjids'}
      </h2>

      {/* Right Group: View Toggle Group + Map Toggle */}
      <div className="flex items-center gap-2 h-[38px]">

        {/* View Toggle Buttons Group (Pencil waTCS spec) */}
        <div className="flex items-center gap-1 h-[38px]">
          
          {/* List View Button */}
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition-all ${
              viewMode === 'list'
                ? 'bg-[#1F5A3B] text-white border-[#1F5A3B]'
                : 'bg-white dark:bg-[#102319] text-[#5A725F] dark:text-[#B8C8B9] border-[#D8D2C2] dark:border-[#355443] hover:border-[#1F5A3B]'
            }`}
            title="List view"
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>

          {/* Grid View Button */}
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition-all ${
              viewMode === 'grid'
                ? 'bg-[#1F5A3B] text-white border-[#1F5A3B]'
                : 'bg-white dark:bg-[#102319] text-[#5A725F] dark:text-[#B8C8B9] border-[#D8D2C2] dark:border-[#355443] hover:border-[#1F5A3B]'
            }`}
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

        </div>

        {/* Map Toggle Button */}
        {onToggleShowMap && (
          <button
            onClick={onToggleShowMap}
            className={`hidden lg:flex h-[38px] items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
              showMap
                ? 'bg-[#1F5A3B] text-white border-[#1F5A3B]'
                : 'bg-white dark:bg-[#102319] text-[#5A725F] dark:text-[#B8C8B9] border-[#D8D2C2] dark:border-[#355443] hover:border-[#1F5A3B]'
            }`}
            title={showMap ? 'Hide map' : 'Show map'}
          >
            <Map className="h-3.5 w-3.5" />
            <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
          </button>
        )}

      </div>

    </div>
  )
}
