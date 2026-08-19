'use client'

import { LayoutGrid, List, ArrowUpDown, Map, Navigation } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DirectoryToolbarProps {
  count: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  sortBy: string
  onSortChange: (sort: string) => void
  showMap?: boolean
  onToggleShowMap?: () => void
  isLocating?: boolean
  onNearMe?: () => void
}

export default function DirectoryToolbar({
  count,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  showMap = true,
  onToggleShowMap,
  isLocating = false,
  onNearMe,
}: DirectoryToolbarProps) {
  return (
    <div className="flex h-[42px] w-full items-center justify-between">
      
      {/* Left: Results Count (Pencil eH7oX spec) */}
      <h2 className="text-lg font-black text-[#173524] dark:text-[#F7F5EF] tracking-tight">
        {count.toLocaleString()} {count === 1 ? 'masjid' : 'masjids'}
      </h2>

      {/* Right Group: Near Me + Sort Control + View Toggle Group + Map Toggle */}
      <div className="flex items-center gap-2 h-[38px]">
        
        {/* Near Me Quick Button */}
        {onNearMe && (
          <button
            onClick={onNearMe}
            className={`flex h-[38px] items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
              sortBy === 'distance'
                ? 'bg-[#1F5A3B] text-white border-[#1F5A3B]'
                : 'bg-white dark:bg-[#102319] text-[#173524] dark:text-[#F7F5EF] border-[#D8D2C2] dark:border-[#355443] hover:border-[#1F5A3B]'
            }`}
            title="Find mosques near my current location"
          >
            <Navigation className={`h-3.5 w-3.5 text-[#1F5A3B] dark:text-[#A3E635] ${sortBy === 'distance' ? 'text-white' : ''} ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>
        )}

        {/* Sort Control Dropdown (Pencil w3QMr spec using Radix UI Select) */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-[38px] w-auto inline-flex shrink-0 rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#102319] px-3 gap-2 text-xs font-semibold text-[#173524] dark:text-[#F7F5EF] hover:border-[#1F5A3B] transition-colors shadow-none">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#5A725F] dark:text-[#B8C8B9] shrink-0" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#102319] border border-[#D8D2C2] dark:border-[#355443] shadow-none z-50">
            <SelectItem value="default" className="text-xs font-semibold">
              Default Order
            </SelectItem>
            <SelectItem value="distance" className="text-xs font-semibold">
              Nearest to Me
            </SelectItem>
            <SelectItem value="name" className="text-xs font-semibold">
              Name (A-Z)
            </SelectItem>
          </SelectContent>
        </Select>

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
