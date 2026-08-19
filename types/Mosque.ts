export type MosqueView = {
  id: number | null;
  name: string | null;
  image_path: string | null;
  country_name: string | null;
  state_id: string | null;
  city_id: string | null;
  state_name: string | null;
  city_name: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  type_id?: string | null;
  status?: string | null;
  jumaat_available?: number | null;
};

export type Mosque = {
  id: number | null;
  name: string | null;
  thumbnailUrl: string | null;
  imageUrls: string[] | null;
  description: string | null;
  googleMapsEmbedded: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  reviewsPerRating: unknown | null;
  countryId: string | null;
  stateId: string | null;
  cityId: string | null;
  websiteUrl: string | null;
  phone: string | null;
  category: string | null;
  status: string | null;
  addedByUserId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  state: {
    id: string | null;
    label: string | null;
  } | null;
  city: {
    id: string | null;
    label: string | null;
  } | null;
};
