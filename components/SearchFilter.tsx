'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { useMosqueFilter } from '@/store/use-mosque-filter'

type DistrictProps = {
  id: number 
  parentId: number | null
  value: string
  label: string
}

export default function SearchFilter() {
  const [states, setStates] = useState<DistrictProps[]>([])
  const [cities, setCities] = useState<DistrictProps[]>([])
  const { 
    stateId, 
    cityId, 
    searchText,
    setStateId, 
    setCityId, 
    setSearchText,
    resetFilters, 
    triggerSearch 
  } = useMosqueFilter()

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states')
        const data = await response.json()
        setStates(data)
      } catch (error) {
        console.error('Failed to fetch states:', error)
      }
    }
    fetchStates()
  }, [])

  // Fetch cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (stateId) {
        try {
          const response = await fetch(`/api/cities?stateId=${stateId}`)
          const data = await response.json()
          setCities(data)
        } catch (error) {
          console.error('Failed to fetch cities:', error)
          setCities([])
        }
      } else {
        setCities([])
      }
    }
    fetchCities()
  }, [stateId])

  return (
    <div className="mb-8 p-4 bg-background rounded-lg border-[1px]">
      <div className="grid gap-4 md:grid-cols-4">
        <Input 
          placeholder="Cari Masjid..." 
          className="md:col-span-2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select 
          value={stateId || ''} 
          onValueChange={setStateId}>
          <SelectTrigger>
            <SelectValue placeholder="Negeri" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={cityId || ''}
          onValueChange={setCityId}
          disabled={!stateId || cities.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Bandar" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={resetFilters} variant="outline">Reset</Button>
        <Button onClick={triggerSearch}>Search</Button>
      </div>
    </div>
  )
}

