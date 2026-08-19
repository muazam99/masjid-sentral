'use client'

import { useEffect, useState } from 'react'
import { Map } from 'lucide-react'
import { useMosqueFilter } from '@/store/use-mosque-filter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type StateItem = {
  id: string
  name?: string
  label?: string
}

const FALLBACK_STATES: StateItem[] = [
  { id: 'my-jhr', name: 'Johor' },
  { id: 'my-kdh', name: 'Kedah' },
  { id: 'my-ktn', name: 'Kelantan' },
  { id: 'my-mlk', name: 'Melaka' },
  { id: 'my-nsn', name: 'Negeri Sembilan' },
  { id: 'my-phg', name: 'Pahang' },
  { id: 'my-prk', name: 'Perak' },
  { id: 'my-pls', name: 'Perlis' },
  { id: 'my-png', name: 'Pulau Pinang' },
  { id: 'my-sbh', name: 'Sabah' },
  { id: 'my-swk', name: 'Sarawak' },
  { id: 'my-sgr', name: 'Selangor' },
  { id: 'my-trg', name: 'Terengganu' },
  { id: 'my-kul', name: 'W.P. Kuala Lumpur' },
  { id: 'my-lbn', name: 'W.P. Labuan' },
  { id: 'my-pjy', name: 'W.P. Putrajaya' },
]

export function StateFilterSelect() {
  const { stateId, setStateId, triggerSearch } = useMosqueFilter()
  const [states, setStates] = useState<StateItem[]>(FALLBACK_STATES)

  useEffect(() => {
    fetch('/api/states?countryId=my')
      .then((res) => res.json() as Promise<StateItem[] | { data?: StateItem[] }>)
      .then((resData) => {
        if (Array.isArray(resData) && resData.length > 0) {
          setStates(resData)
        } else if ('data' in resData && Array.isArray(resData.data) && resData.data.length > 0) {
          setStates(resData.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <Select
      value={stateId || 'all'}
      onValueChange={(val) => {
        setStateId(val === 'all' ? null : val)
        triggerSearch()
      }}
    >
      <SelectTrigger className="h-[42px] w-auto inline-flex shrink-0 rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-white dark:bg-[#102319] px-3.5 gap-2 text-xs font-semibold text-[#173524] dark:text-[#F7F5EF] hover:border-[#1F5A3B] transition-colors shadow-none">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-[#5A725F] dark:text-[#B8C8B9] shrink-0" />
          <SelectValue placeholder="All states" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-[#102319] border border-[#D8D2C2] dark:border-[#355443] shadow-none z-50">
        <SelectItem value="all" className="text-xs font-semibold">
          All states
        </SelectItem>
        {states.map((st) => (
          <SelectItem key={st.id} value={st.id} className="text-xs font-semibold">
            {st.label || st.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
