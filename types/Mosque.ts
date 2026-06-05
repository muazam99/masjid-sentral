export type MosqueView = {
  id: number | null;
  name: string | null;
  image_path: string | null;
  country_name: string | null;
  state_id: string | null;
  city_id: string | null;
  state_name: string | null;
  city_name: string | null;
};

export type Mosque = {
  id: number | null;
  name: string | null;
  thumbnailUrl: string | null;
  imageUrls: string[] | null;  // Changed from image_urls to camelCase
  description: string | null;
  googleMapsEmbedded: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;  // Changed from string to number
  longitude: number | null;  // Changed from string to number
  address: string | null;
  reviewsPerRating: unknown | null;  // New field - JSONB data
  countryId: string | null;
  stateId: string | null;
  cityId: string | null;
  websiteUrl: string | null;  // New field
  phone: string | null;
  category: string | null;
  status: string | null;
  addedByUserId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  // Related data
  state: {
    id: string | null;
    label: string | null;
  } | null;
  city: {
    id: string | null;
    label: string | null;
  } | null;
};
