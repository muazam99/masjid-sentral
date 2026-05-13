import { cache } from "react";
import { supabase } from "./index";

export type { Mosque } from "@/types/Mosque";

export const getMasjidById = cache(async (id: number) => {
  const { data, error } = await supabase
    .from('mosques')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  // Convert snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    thumbnailUrl: data.thumbnail_url,
    imageUrls: data.image_urls,
    description: data.description,
    googleMapsEmbedded: data.google_maps_embedded,
    googleMapsUrl: data.google_maps_url,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,
    reviewsPerRating: data.reviews_per_rating,
    countryId: data.country_id,
    stateId: data.state_id,
    districtId: data.district_id,
    websiteUrl: data.website_url,
    phone: data.phone,
    category: data.category,
    status: data.status,
    addedByUserId: data.added_by_user_id,
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    state: null,
    city: null,
  };
});

export const getCountries = cache(async () => {
  const { data } = await supabase.from('countries').select('*').order('name');
  return data || [];
});

export const getStates = cache(async (countryId = 1) => {
  const { data } = await supabase.from('states').select('*').eq('country_id', countryId).order('name');
  return data || [];
});

export const getStateById = cache(async (id: number) => {
  const { data } = await supabase.from('states').select('*').eq('id', id).single();
  return data || null;
});

export const getCities = cache(async (stateId: number) => {
  const { data } = await supabase.from('districts').select('*').eq('state_id', stateId).order('name');
  return data || [];
});

export const getCityById = cache(async (id: number) => {
  const { data } = await supabase.from('districts').select('*').eq('id', id).single();
  return data || null;
});
