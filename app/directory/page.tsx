'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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

type MosqueApiResponse = {
  data?: MosqueView[]
  count?: number
  error?: string
}

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('default')

  const { countryId, stateId, cityId, searchText, searchTrigger, totalCount, setTotalCount } =
    useMosqueFilter()

  const fetchMosques = useCallback(
    async (page: number): Promise<MosqueView[]> => {
      const cacheKey = `mosques_${countryId}_${stateId}_${cityId}_${searchText}_${page}`
      const cachedData = localStorage.getItem(cacheKey)

      if (cachedData) {
        try {
          const { timestamp, data, count } = JSON.parse(cachedData)
          const isStale =
            Array.isArray(data) &&
            data.some((item: MosqueView) => item.state_name?.startsWith('my-'))

          if (!isStale && Date.now() - timestamp < 3600000 && Array.isArray(data) && data.length > 0) {
            if (page === 1 && typeof count === 'number') {
              setTotalCount(count)
            }
            return data
          }
        } catch {
          // ignore cache parse error
        }
        localStorage.removeItem(cacheKey)
      }

      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', '24')

        if (countryId) params.set('countryId', countryId)
        if (stateId) params.set('stateId', stateId)
        if (cityId) params.set('cityId', cityId)
        if (searchText) params.set('q', searchText)

        const response = await fetch(`/api/mosque?${params.toString()}`)
        const data = (await response.json()) as MosqueApiResponse

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch mosques')
        }

        const items = Array.isArray(data.data) ? data.data : []
        if (page === 1) {
          setTotalCount(typeof data.count === 'number' ? data.count : items.length)
        }

        if (items.length > 0) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              timestamp: Date.now(),
              data: items,
              count: data.count,
            })
          )
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
      refresh()
    }
  }, [searchTrigger, refresh])

  const displayMosques = [...mosques].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    }
    return 0
  })

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        {/* Page Header (Title + Subtitle) */}
        <DirectoryHeader totalCount={totalCount} />

        {/* Directory Search & Filter Panel */}
        <DirectorySearchPanel />

        {/* Split Layout: Results Column (7 Cols) + Sticky Map Column (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Results Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Results Header Toolbar (Count on Left, Sort + View Mode Toggle on Right) */}
            <DirectoryToolbar
              count={totalCount ?? displayMosques.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Cards View */}
            {loading && displayMosques.length === 0 ? (
              <div className="py-12">
                <Loading />
              </div>
            ) : displayMosques.length === 0 ? (
              <div className="rounded-lg border border-[#D8D2C2] dark:border-[#355443] bg-card p-10 text-center space-y-2">
                <p className="text-base font-extrabold text-foreground">No masjids found</p>
                <p className="text-xs text-muted-foreground">
                  Try broadening your search query or resetting active filters.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayMosques.map((m) => {
                  const imageUrl = getR2ImageUrl(m.image_path)
                  return (
                    <MosqueCardGrid
                      key={m.id}
                      mosque={{ ...m, image_path: imageUrl }}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {displayMosques.map((m) => {
                  const imageUrl = getR2ImageUrl(m.image_path)
                  return (
                    <MosqueCardList
                      key={m.id}
                      mosque={{ ...m, image_path: imageUrl }}
                    />
                  )
                })}
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {loading && <Loading />}
              {!hasMore && displayMosques.length > 0 && (
                <p className="text-xs text-muted-foreground font-medium">
                  End of directory results
                </p>
              )}
            </div>

          </div>

          {/* Sticky Interactive Map Column */}
          <div className="hidden lg:block lg:col-span-5 sticky top-20">
            <DirectoryMap mosques={displayMosques} height="650px" />
          </div>

        </div>

      </div>
    </Layout>
  )
}
