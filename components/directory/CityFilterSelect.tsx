'use client'

import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import { useMosqueFilter } from '@/store/use-mosque-filter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CityItem = {
  id: string
  name?: string
  label?: string
}

export function CityFilterSelect() {
  const { stateId, cityId, setCityId, triggerSearch } = useMosqueFilter()
  const [cities, setCities] = useState<CityItem[]>([])

  useEffect(() => {
    if (!stateId) {
      setCities([])
      return
    }

    fetch(`/api/cities?stateId=${stateId}`)
      .then((res) => res.json() as Promise<CityItem[] | { data?: CityItem[] }>)
      .then((resData) => {
        if (Array.isArray(resData)) {
          setCities(resData)
        } else if ('data' in resData && Array.isArray(resData.data)) {
          setCities(resData.data)
        }
      })
      .catch(() => {})
  }, [stateId])

  return (
    <Select
      value={cityId || 'all'}
      disabled={!stateId}
      onValueChange={(val) => {
        setCityId(val === 'all' ? null : val)
        triggerSearch()
      }}
    >
      <SelectTrigger className="h-[42px] w-auto inline-flex shrink-0 rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#102319] px-3.5 gap-2 text-xs font-semibold text-[#173524] dark:text-[#F7F5EF] hover:border-[#1F5A3B] transition-colors shadow-none disabled:opacity-50">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#5A725F] dark:text-[#B8C8B9] shrink-0" />
          <SelectValue placeholder="All districts" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-[#102319] border border-[#D8D2C2] dark:border-[#355443] shadow-none z-50">
        <SelectItem value="all" className="text-xs font-semibold">
          All districts
        </SelectItem>
        {cities.map((ct) => (
          <SelectItem key={ct.id} value={ct.id} className="text-xs font-semibold">
            {ct.label || ct.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
