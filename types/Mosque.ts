export type MosqueView = {
  id: number | null;
  name: string | null;
  imagePath: string | null;  // Changed from imageUrl to match SQL view
  countryName: string | null;
  stateId: number | null;
  cityId: number | null;
  stateName: string | null;
  cityName: string | null;
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
  countryId: number | null;
  stateId: number | null;
  districtId: number | null;  // Changed from cityId to districtId
  websiteUrl: string | null;  // New field
  phone: string | null;
  category: string | null;
  status: string | null;
  addedByUserId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  // Related data
  state: {
    id: number | null;
    label: string | null;
  } | null;
  city: {
    id: number | null;
    label: string | null;
  } | null;
};
