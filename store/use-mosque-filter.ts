import { create } from 'zustand'

interface MosqueFilterState {
  countryId: string
  stateId: string | null
  cityId: string | null
  searchText: string
  totalCount: number | null
  searchTrigger: number  // Add this to force refresh
  setCountryId: (id: string) => void
  setStateId: (id: string | null) => void
  setCityId: (id: string | null) => void
  setSearchText: (text: string) => void
  setTotalCount: (count: number | null) => void
  resetFilters: () => void
  triggerSearch: () => void  // Add this function
}

export const useMosqueFilter = create<MosqueFilterState>((set) => ({
  countryId: '1',
  stateId: null,
  cityId: null,
  searchText: '',
  totalCount: null,
  searchTrigger: 0,
  setCountryId: (id) => set({ countryId: id, stateId: null, cityId: null }),
  setStateId: (id) => set({ stateId: id, cityId: null }), // Reset cityId when state changes
  setCityId: (id) => set({ cityId: id }),
  setSearchText: (text) => set({ searchText: text }),
  setTotalCount: (count) => set({ totalCount: count }),
  resetFilters: () => set({ countryId: '1', stateId: null, cityId: null, searchText: '', totalCount: null, searchTrigger: Date.now() }),
  triggerSearch: () => set((_) => ({ searchTrigger: Date.now() })),
})) 
