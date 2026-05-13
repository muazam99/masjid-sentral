'use client';
import MosqueCard from "./MosqueCard"
import { getR2ImageUrl } from "@/utils/images"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { MosqueView } from '@/types/Mosque';
import { useCallback, useEffect, useRef } from 'react'
import { useMosqueFilter } from '@/store/use-mosque-filter'
import Loading from "@/app/(main)/loading";

const MosqueGrid = () => {
  const { stateId, cityId, searchText, searchTrigger } = useMosqueFilter()

  const fetchMosques = useCallback(async (page: number): Promise<MosqueView[]> => {
    const cacheKey = `mosques_${stateId}_${cityId}_${searchText}_${page}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      // Check if cache is still valid (1 hour)
      if (Date.now() - timestamp < 3600000 && Array.isArray(data) && data.length > 0) {
        return data;
      }

      localStorage.removeItem(cacheKey);
    }

    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '25')

      if (stateId) params.set('stateId', stateId)
      if (cityId) params.set('cityId', cityId)
      if (searchText) params.set('q', searchText)

      const response = await fetch(`/api/mosque?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch mosques");
      }

      const items = Array.isArray(data.data) ? data.data : [];
      
      // Cache successful non-empty pages only so a transient API issue does not hide data.
      if (items.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: items
        }));
      }
      
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

  // Track last searchTrigger to prevent duplicate refresh calls
  const lastSearchTrigger = useRef<number | null>(null);

  // Only depend on searchTrigger, not refresh
  useEffect(() => {
    // Only refresh if searchTrigger actually changed
    if (searchTrigger !== lastSearchTrigger.current) {
      lastSearchTrigger.current = searchTrigger;
      refresh();
    }
  }, [searchTrigger, refresh]);

  // Log when mosques change
  useEffect(() => {
    console.log('Mosques state updated:', mosques.length, 'items');
    const ids = mosques.map(m => m.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      console.warn('DUPLICATE IDs in mosques state:', duplicateIds);
    }
  }, [mosques]);

  if (loading && mosques.length === 0) {
    return (
      <Loading />
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {mosques.map((mosque) => {
        const imageUrl = getR2ImageUrl(mosque.image_path);
        return (
          <MosqueCard
            key={mosque.id}
            id={mosque.id || 0}
            name={mosque.name || ''}
            cityName={mosque.city_name || ''}
            stateName={mosque.state_name || ''}
            imageUrl={imageUrl}
          />
        );
      })}
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

