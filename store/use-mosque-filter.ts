import { create } from 'zustand'

interface MosqueFilterState {
  stateId: string | null
  cityId: string | null
  searchText: string
  searchTrigger: number  // Add this to force refresh
  setStateId: (id: string | null) => void
  setCityId: (id: string | null) => void
  setSearchText: (text: string) => void
  resetFilters: () => void
  triggerSearch: () => void  // Add this function
}

export const useMosqueFilter = create<MosqueFilterState>((set) => ({
  stateId: null,
  cityId: null,
  searchText: '',
  searchTrigger: 0,
  setStateId: (id) => set({ stateId: id, cityId: null }), // Reset cityId when state changes
  setCityId: (id) => set({ cityId: id }),
  setSearchText: (text) => set({ searchText: text }),
  resetFilters: () => set({ stateId: null, cityId: null, searchText: '', searchTrigger: Date.now() }),
  triggerSearch: () => set((_) => ({ searchTrigger: Date.now() })),
})) 