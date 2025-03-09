import { create } from 'zustand'

interface MosqueFilterState {
  stateId: string | null
  cityId: string | null
  searchTrigger: number  // Add this to force refresh
  setStateId: (id: string | null) => void
  setCityId: (id: string | null) => void
  resetFilters: () => void
  triggerSearch: () => void  // Add this function
}

export const useMosqueFilter = create<MosqueFilterState>((set) => ({
  stateId: null,
  cityId: null,
  searchTrigger: 0,
  setStateId: (id) => set({ stateId: id, cityId: null }), // Reset cityId when state changes
  setCityId: (id) => set({ cityId: id }),
  resetFilters: () => set({ stateId: null, cityId: null, searchTrigger: Date.now() }),
  triggerSearch: () => set((_) => ({ searchTrigger: Date.now() })),
})) 