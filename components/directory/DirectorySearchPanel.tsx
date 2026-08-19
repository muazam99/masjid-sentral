'use client'

import React, { useState } from 'react'
import { Search, SlidersHorizontal, X, ArrowRight, ChevronDown, Navigation } from 'lucide-react'
import { useMosqueFilter } from '@/store/use-mosque-filter'
import { StateFilterSelect } from './StateFilterSelect'
import { CityFilterSelect } from './CityFilterSelect'

interface DirectorySearchPanelProps {
  sortBy: string
  isLocating?: boolean
  onNearMe?: () => void
}

export default function DirectorySearchPanel({
  sortBy,
  isLocating = false,
  onNearMe,
}: DirectorySearchPanelProps) {
  const {
    searchText,
    setSearchText,
    triggerSearch,
    resetFilters,
    stateId,
    cityId,
  } = useMosqueFilter()

  const [localSearch, setLocalSearch] = useState(searchText)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchText(localSearch)
    triggerSearch()
  }

  const hasActiveFilters = Boolean(stateId || cityId || searchText || localSearch)

  return (
    <div className="w-full rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#172D20] p-4.5 space-y-3.5">
      
      {/* Search Input & Button Row */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
        
        {/* Search Input Box */}
        <div className="relative flex-1 flex items-center h-[52px] rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-[#F7F5EF] dark:bg-[#102319] px-4 gap-3">
          <Search className="h-5 w-5 text-[#5A725F] dark:text-[#B8C8B9] shrink-0" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search masjid name, city, district, or postcode"
            className="w-full bg-transparent text-sm sm:text-base font-normal text-[#173524] dark:text-[#F7F5EF] placeholder-[#5A725F] dark:placeholder-[#B8C8B9] focus:outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('')
                setSearchText('')
                triggerSearch()
              }}
              className="p-1 text-[#5A725F] hover:text-[#173524] dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Primary Emerald Search Button */}
        <button
          type="submit"
          className="h-[52px] px-5.5 rounded-lg bg-[#1F5A3B] hover:bg-[#1F5A3B]/90 text-white font-bold text-sm sm:text-base flex items-center gap-2 border border-transparent transition-colors shrink-0"
        >
          <span>Search</span>
          <ArrowRight className="h-4.5 w-4.5 text-white" />
        </button>

      </form>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
        
        {/* State Filter Select */}
        <StateFilterSelect />

        {/* City/District Filter Select */}
        <CityFilterSelect />

        {/* Facilities Filter Placeholder Button */}
        <div className="relative inline-flex items-center h-[42px] rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#102319] px-3.5 text-xs font-semibold text-[#173524] dark:text-[#F7F5EF] gap-2 cursor-pointer hover:border-[#1F5A3B]">
          <SlidersHorizontal className="h-4 w-4 text-[#5A725F] dark:text-[#B8C8B9]" />
          <span>Facilities</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#5A725F] dark:text-[#B8C8B9]" />
        </div>

        {/* Near Me Quick Button */}
        {onNearMe && (
          <button
            type="button"
            onClick={onNearMe}
            className={`flex h-[42px] items-center gap-1.5 px-3.5 rounded-lg border text-xs font-semibold transition-all ${
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

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch('')
              resetFilters()
            }}
            className="h-[42px] px-2.5 text-xs font-semibold text-[#5A725F] dark:text-[#B8C8B9] hover:text-[#173524] dark:hover:text-white flex items-center gap-1.5 transition-colors ml-auto"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        )}

      </div>

    </div>
  )
}
