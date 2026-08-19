import { cache } from "react";
import {
  fetchMasjidByIdFromApi,
  fetchCountriesFromApi,
  fetchStatesFromApi,
  fetchCitiesFromApi,
} from "@/lib/api";

export type { Mosque } from "@/types/Mosque";

export const getMasjidById = cache(async (id: number) => {
  return fetchMasjidByIdFromApi(id);
});

export const getCountries = cache(async () => {
  return fetchCountriesFromApi();
});

export const getStates = cache(async (countryId = "my") => {
  return fetchStatesFromApi(countryId);
});

export const getStateById = cache(async (id: string) => {
  const states = await fetchStatesFromApi();
  return states.find((s) => s.id === id) ?? null;
});

export const getCities = cache(async (stateId: string) => {
  return fetchCitiesFromApi(stateId);
});

export const getCityById = cache(async (id: string) => {
  const [stateId] = id.split("-");
  const cities = await fetchCitiesFromApi(stateId || id);
  return cities.find((c) => c.id === id) ?? null;
});
