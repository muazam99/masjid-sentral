'use client';
import MosqueCard from "./MosqueCard"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { MosqueView } from '@/types/Mosque';
import { useCallback, useEffect } from 'react'
import { useMosqueFilter } from '@/store/use-mosque-filter'
import Loading from "@/app/(main)/loading";

const MosqueGrid = () => {
  const { stateId, cityId, searchText, searchTrigger } = useMosqueFilter()

  const fetchMosques = useCallback(async (page: number): Promise<MosqueView[]> => {
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '25')

      if (stateId) params.set('stateId', stateId)
      if (cityId) params.set('cityId', cityId)
      if (searchText) params.set('q', searchText)

      const response = await fetch(`/api/mosque?${params.toString()}`);
      const data = await response.json();
      const items = Array.isArray(data.data) ? data.data : [];
      return items;
    } catch (error) {
      console.error("Error fetching mosques:", error);
      return [];
    }
  }, [stateId, cityId, searchText])

  const { 
    items: mosques, 
    loading, 
    hasMore, 
    loadMoreRef,
    refresh 
  } = useInfiniteScroll<MosqueView>([], fetchMosques);

  // Only depend on searchTrigger
  useEffect(() => {
    refresh();
  }, [searchTrigger]);

  if (loading && mosques.length === 0) {
    return (
      <Loading />
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {mosques.map((mosque) => (
        <MosqueCard 
          key={mosque.id}  
          id={mosque.id || 0}
          name={mosque.name || ''}
          cityName={mosque.cityName || ''}
          stateName={mosque.stateName || ''}
          imageUrl={mosque.imageUrl || ''}
        />
      ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {loading && (
          <Loading />
        )}
        {!hasMore && mosques.length > 0 && <p className="text-muted-foreground">No more mosques to load</p>}
      </div>
    </div>
  )
}

export default MosqueGrid;

