'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import DirectoryHeader from '@/components/directory/DirectoryHeader'
import DirectorySearchPanel from '@/components/directory/DirectorySearchPanel'
import DirectoryToolbar from '@/components/directory/DirectoryToolbar'
import MosqueCardGrid from '@/components/directory/MosqueCardGrid'
import MosqueCardList from '@/components/directory/MosqueCardList'
import DirectoryMap from '@/components/directory/DirectoryMap'
import Loading from '@/app/(main)/loading'
import { useMosqueFilter } from '@/store/use-mosque-filter'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { MosqueView } from '@/types/Mosque'
import { getR2ImageUrl } from '@/utils/images'
import { calculateDistanceKm, formatDistance } from '@/lib/api'

type MosqueApiResponse = {
  data?: MosqueView[]
  count?: number
  error?: string
}

type MapArea = {
  lat: number
  lng: number
  radius: number
}

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('distance')
  const [showMap, setShowMap] = useState<boolean>(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState<boolean>(false)
  const [locateTrigger, setLocateTrigger] = useState<number>(0)
  const mapAreaRef = useRef<MapArea | null>(null)
  const isAutoLocatedRef = useRef<boolean>(false)

  const {
    countryId,
    stateId,
    cityId,
    searchText,
    searchTrigger,
    totalCount,
    setTotalCount,
    setStateId,
    setCityId,
  } = useMosqueFilter()

  // Clean up any stale localStorage keys from previous sessions on mount
  useEffect(() => {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('mosques_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k))
    } catch {
      // ignore
    }
  }, [])

  const fetchMosques = useCallback(
    async (page: number): Promise<MosqueView[]> => {
      const currentArea = mapAreaRef.current

      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', '24')

        if (currentArea) {
          params.set('lat', currentArea.lat.toString())
          params.set('lng', currentArea.lng.toString())
          params.set('radius', currentArea.radius.toString())
        } else {
          if (countryId) params.set('countryId', countryId)
          if (stateId && stateId !== 'all') params.set('stateId', stateId)
          if (cityId && cityId !== 'all') params.set('cityId', cityId)
          if (searchText) params.set('q', searchText)
        }

        const response = await fetch(`/api/mosque?${params.toString()}`)
        const data = (await response.json()) as MosqueApiResponse

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch mosques')
        }

        const items = Array.isArray(data.data) ? data.data : []
        if (page === 1) {
          setTotalCount(typeof data.count === 'number' ? data.count : items.length)
        }

        return items
      } catch (error) {
        console.error('Error fetching mosques:', error)
        if (page === 1) setTotalCount(0)
        return []
      }
    },
    [countryId, stateId, cityId, searchText, setTotalCount]
  )

  const { items: mosques, loading, hasMore, loadMoreRef, refresh } = useInfiniteScroll<MosqueView>(
    [],
    fetchMosques
  )

  const lastSearchTrigger = useRef<number | null>(null)

  useEffect(() => {
    if (searchTrigger !== lastSearchTrigger.current) {
      lastSearchTrigger.current = searchTrigger
      mapAreaRef.current = null
      refresh()
    }
  }, [searchTrigger, refresh])

  const handleMapSearchArea = useCallback(
    (center: { lat: number; lng: number }, radius: number) => {
      mapAreaRef.current = { lat: center.lat, lng: center.lng, radius }
      refresh()
    },
    [refresh]
  )

  const handleToggleShowMap = useCallback(() => {
    setShowMap((prev) => {
      const next = !prev
      if (!next && mapAreaRef.current) {
        mapAreaRef.current = null
        refresh()
      }
      return next
    })
  }, [refresh])

  const requestLocation = useCallback(
    (onSuccess?: (loc: { lat: number; lng: number }) => void, isAuto = false) => {
      if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        if (!isAuto) {
          alert('Geolocation is not supported by your browser.')
        } else {
          setSortBy('default')
        }
        return
      }

      setIsLocating(true)

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false)
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
          setLocateTrigger(Date.now())
          if (onSuccess) {
            onSuccess(loc)
          }
        },
        (err) => {
          setIsLocating(false)
          console.warn('Geolocation error:', err)
          if (!isAuto) {
            if (err.code === 1) {
              alert('Location permission was denied. Please allow location access in your browser settings.')
            } else {
              alert('Could not determine location. Please check device location services.')
            }
          } else {
            setSortBy('default')
          }
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
      )
    },
    []
  )

  // Automatically locate user on mount to make Near Me default
  useEffect(() => {
    if (!isAutoLocatedRef.current) {
      isAutoLocatedRef.current = true
      requestLocation((loc) => {
        mapAreaRef.current = { lat: loc.lat, lng: loc.lng, radius: 20 }
        refresh()
      }, true)
    }
  }, [requestLocation, refresh])

  const handleNearMeClick = useCallback(() => {
    // When Near Me is clicked, reset state/city filters so there's no conflict with user location
    setStateId(null)
    setCityId(null)
    setSortBy('distance')

    requestLocation((loc) => {
      mapAreaRef.current = { lat: loc.lat, lng: loc.lng, radius: 20 }
      refresh()
    }, false)
  }, [setStateId, setCityId, requestLocation, refresh])

  // Memoized so the array reference is stable across unrelated re-renders —
  // MapRecenter relies on this prop only changing when the underlying data does
  // (Pitfall: an unmemoized array here caused the map to consume a pending
  // recenter using the stale pre-fetch list, before new filter results arrived)
  const sortedMosques = useMemo(() => {
    const displayMosquesWithDistance = mosques.map((m) => {
      let distanceKm: number | null = null
      let distanceStr: string | undefined = undefined

      if (
        userLocation &&
        typeof m.lat === 'number' &&
        typeof m.lng === 'number' &&
        m.lat !== 0 &&
        m.lng !== 0
      ) {
        distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, m.lat, m.lng)
        distanceStr = formatDistance(distanceKm)
      }

      return {
        ...m,
        distanceKm,
        distanceStr,
      }
    })

    return [...displayMosquesWithDistance].sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }
      if (sortBy === 'distance') {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm
        }
        if (a.distanceKm !== null) return -1
        if (b.distanceKm !== null) return 1
      }
      return 0
    })
  }, [mosques, userLocation, sortBy])

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        {/* Page Header (Title + Subtitle) */}
        <DirectoryHeader totalCount={totalCount} />

        {/* Directory Search & Filter Panel */}
        <DirectorySearchPanel
          sortBy={sortBy}
          isLocating={isLocating}
          onNearMe={handleNearMeClick}
        />

        {/* Split Layout: Results Column + Sticky Map Column */}
        <div className={`grid grid-cols-1 ${showMap ? 'lg:grid-cols-12 gap-6' : ''} items-start`}>
          
          {/* Results Column */}
          <div className={`${showMap ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
            
            {/* Results Header Toolbar (Count on Left, Sort + View Mode + Map Toggle on Right) */}
            <DirectoryToolbar
              count={totalCount ?? sortedMosques.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showMap={showMap}
              onToggleShowMap={handleToggleShowMap}
            />

            {/* Cards View */}
            {loading && sortedMosques.length === 0 ? (
              <div className="py-12">
                <Loading />
              </div>
            ) : sortedMosques.length === 0 ? (
              <div className="rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-card p-10 text-center space-y-2">
                <p className="text-base font-extrabold text-foreground">No masjids found</p>
                <p className="text-xs text-muted-foreground">
                  Try broadening your search query or resetting active filters.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showMap ? '' : 'md:grid-cols-3 xl:grid-cols-4'} gap-4`}>
                {sortedMosques.map((m) => {
                  const imageUrl = getR2ImageUrl(m.image_path)
                  return (
                    <MosqueCardGrid
                      key={m.id}
                      mosque={{ ...m, image_path: imageUrl }}
                      distanceStr={m.distanceStr}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedMosques.map((m) => {
                  const imageUrl = getR2ImageUrl(m.image_path)
                  return (
                    <MosqueCardList
                      key={m.id}
                      mosque={{ ...m, image_path: imageUrl }}
                      distanceStr={m.distanceStr}
                    />
                  )
                })}
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {loading && <Loading />}
              {!hasMore && sortedMosques.length > 0 && (
                <p className="text-xs text-muted-foreground font-medium">
                  End of directory results
                </p>
              )}
            </div>

          </div>

          {/* Sticky Interactive Map Column */}
          {showMap && (
            <div className="hidden lg:block lg:col-span-5 sticky top-20">
              <DirectoryMap
                mosques={sortedMosques}
                height="calc(100vh - 6rem)"
                isLoading={loading}
                onSearchArea={handleMapSearchArea}
                resetRecenterTrigger={searchTrigger}
                userLocation={userLocation}
                locateTrigger={locateTrigger}
              />
            </div>
          )}

        </div>

      </div>
    </Layout>
  )
}
