'use client';
import MosqueCard from "./MosqueCard"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Loader2 } from "lucide-react"
import { MosqueView } from '@/types/Mosque';

const MosqueGrid = () => {

  const fetchMosques = async (page: number): Promise<MosqueView[]> => {
    try {
      const response = await fetch(`/api/mosque?page=${page}&limit=25`);
      const data = await response.json();
      const items = Array.isArray(data.data) ? data.data : [];
      return items;
    } catch (error) {
      console.error("Error fetching mosques:", error);
      return [];
    }
  }

  const { 
    items: mosques, 
    loading, 
    hasMore, 
    loadMoreRef 
  } = useInfiniteScroll<MosqueView>([], fetchMosques);

  if (loading && mosques.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Loading more mosques...</span>
          </div>
        )}
        {!hasMore && mosques.length > 0 && <p className="text-muted-foreground">No more mosques to load</p>}
      </div>
    </div>
  )
}

export default MosqueGrid;

