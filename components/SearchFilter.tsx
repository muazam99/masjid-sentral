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
  stateId: number | null  // Changed from parentId
  name: string  // Changed from value/label to name
  code: string | null
}

type LocationProps = {
  id: number
  name: string
  code: string | null
}

export default function SearchFilter() {
  const [countries, setCountries] = useState<LocationProps[]>([])
  const [states, setStates] = useState<LocationProps[]>([])
  const [cities, setCities] = useState<DistrictProps[]>([])
  const { 
    countryId,
    stateId, 
    cityId,
    searchText,
    totalCount,
    setCountryId,
    setStateId, 
    setCityId,
    setSearchText,
    resetFilters, 
    triggerSearch 
  } = useMosqueFilter()

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        setCountries(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch countries:', error)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchStates = async () => {
      try {
        const response = await fetch(`/api/states?countryId=${countryId}`)
        const data = await response.json()
        if (!cancelled) {
          setStates(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Failed to fetch states:', error)
        if (!cancelled) setStates([])
      }
    }

    fetchStates()
    return () => {
      cancelled = true
    }
  }, [countryId])

  useEffect(() => {
    if (!stateId) return

    let cancelled = false
    const fetchCities = async () => {
      try {
        const response = await fetch(`/api/cities?stateId=${stateId}`)
        const data = await response.json()
        if (!cancelled) {
          setCities(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error)
        if (!cancelled) setCities([])
      }
    }

    fetchCities()
    return () => {
      cancelled = true
    }
  }, [stateId])

  // Derive visible cities from current stateId so we don't need to reset state
  // in an effect when stateId clears.
  const visibleCities = stateId ? cities : []

  return (
    <>
    <div className="mb-8 rounded-lg border-[1px] bg-background p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Input 
          placeholder="Cari Masjid..." 
          className="lg:flex-1"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              triggerSearch()
            }
          }}
        />
        <Select
          value={countryId}
          onValueChange={setCountryId}>
          <SelectTrigger className="lg:w-40">
            <SelectValue placeholder="Negara" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={stateId || ''} 
          onValueChange={setStateId}>
          <SelectTrigger className="lg:w-40">
            <SelectValue placeholder="Negeri" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={cityId || ''}
          onValueChange={setCityId}
          disabled={!stateId || visibleCities.length === 0}>
          <SelectTrigger className="lg:w-40">
            <SelectValue placeholder="Bandar" />
          </SelectTrigger>
          <SelectContent>
            {visibleCities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
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
    <p className="-mt-4 mb-6 text-sm text-muted-foreground">
      {totalCount === null ? 'Jumlah masjid akan dipaparkan selepas carian.' : `${totalCount.toLocaleString()} masjid dijumpai`}
    </p>
    </>
  )
}
