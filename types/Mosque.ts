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

export interface MosqueFacility {
  id: number;
  masjid_id: number;
  facility: string;
}

export interface MosqueContact {
  id?: number;
  masjid_id: number;
  type: string; // 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'whatsapp' | 'website' | 'phone' | 'email'
  value: string;
}

export interface MosqueReview {
  id: number;
  masjid_id: number;
  rating: number;
  message: string | null;
  source_app: string;
  created_at: string;
  user_name?: string;
  user_initial?: string;
  context_tag?: string;
}

export interface MosqueEvent {
  id: number;
  masjid_id: number;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  status: string;
  rrule: string | null;
  image_url?: string | null;
  location?: string | null;
}

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
  reviewsPerRating: Record<number, number> | null;
  countryId: string | null;
  stateId: string | null;
  cityId: string | null;
  countryName: string | null;
  stateName: string | null;
  cityName: string | null;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  category: string | null; // 'masjid' | 'surau' | 'musolla'
  status: string | null;
  jumaatAvailable: boolean;
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
  facilities: MosqueFacility[];
  contacts: MosqueContact[];
  reviews: MosqueReview[];
  events: MosqueEvent[];
  avgRating: number | null;
  reviewCount: number;
};
