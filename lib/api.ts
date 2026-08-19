import { Mosque, MosqueView } from "@/types/Mosque";

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) {
    return "https://api.masjidsentral.workers.dev";
  }

  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl.replace(/\/+$/, "");
  }

  return `https://${envUrl.replace(/\/+$/, "")}`;
}

const STATE_NAMES: Record<string, string> = {
  "my-jhr": "Johor",
  "my-kdh": "Kedah",
  "my-ktn": "Kelantan",
  "my-mlk": "Melaka",
  "my-nsn": "Negeri Sembilan",
  "my-phg": "Pahang",
  "my-prk": "Perak",
  "my-pls": "Perlis",
  "my-png": "Pulau Pinang",
  "my-sbh": "Sabah",
  "my-swk": "Sarawak",
  "my-sgr": "Selangor",
  "my-trg": "Terengganu",
  "my-kul": "W.P. Kuala Lumpur",
  "my-lbn": "W.P. Labuan",
  "my-pjy": "W.P. Putrajaya",
};

export function formatLocationName(id: string | null | undefined): string | null {
  if (!id) return null;

  const lower = id.toLowerCase();
  if (STATE_NAMES[lower]) {
    return STATE_NAMES[lower];
  }

  const parts = id.split("-");
  if (parts.length > 1) {
    const rawName = parts[parts.length - 1];
    return rawName.charAt(0).toUpperCase() + rawName.slice(1);
  }

  return id.charAt(0).toUpperCase() + id.slice(1);
}

export type ApiMasjidListItem = {
  id: number;
  name: string;
  type_id: string;
  state_id: string;
  city_id: string | null;
  country_id: string;
  state_name?: string | null;
  city_name?: string | null;
  country_name?: string | null;
  address: string | null;
  lat: number;
  lng: number;
  jumaat_available: number;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
};

export type ApiMasjidDetail = {
  id: number;
  name: string;
  type_id: string;
  lat: number;
  lng: number;
  geohash: string;
  city_id: string | null;
  state_id: string;
  country_id: string;
  state_name?: string | null;
  city_name?: string | null;
  country_name?: string | null;
  address: string | null;
  description: string | null;
  status: string;
  jumaat_available: number;
  telephone: string | null;
  email: string | null;
  google_url: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  images?: Array<{
    id: number;
    masjid_id: number;
    path: string;
    is_thumbnail: number;
    sort_order: number;
    created_at: string;
    thumbnail_url?: string | null;
    full_url?: string | null;
  }>;
  facilities?: Array<{ id: number; masjid_id: number; facility: string }>;
  contacts?: Array<{ masjid_id: number; type: string; value: string }>;
  reviews?: Array<{
    id: number;
    masjid_id: number;
    rating: number;
    message: string | null;
    source_app: string;
    created_at: string;
  }>;
  events?: Array<{
    id: number;
    masjid_id: number;
    title: string;
    description: string | null;
    start_at: string;
    end_at: string | null;
    status: string;
    rrule: string | null;
  }>;
  avg_rating?: number | null;
  review_count?: number;
};

export type ApiListResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
};

export async function fetchMasjidsFromApi(options: {
  page?: number;
  limit?: number;
  countryId?: string | null;
  stateId?: string | null;
  cityId?: string | null;
  type?: string | null;
  jumaat?: boolean | null;
  q?: string | null;
}): Promise<{ data: MosqueView[]; count: number }> {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();

  if (options.page) params.set("page", options.page.toString());
  if (options.stateId) params.set("state", options.stateId);
  if (options.cityId) params.set("city", options.cityId);
  if (options.type) params.set("type", options.type);
  if (options.jumaat) params.set("jumaat", "1");
  if (options.q) params.set("q", options.q);

  const res = await fetch(`${baseUrl}/masjids?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const result = (await res.json()) as ApiListResponse<ApiMasjidListItem>;
  const items = Array.isArray(result.data) ? result.data : [];
  const total = result.meta?.total ?? items.length;

  const mosqueViews: MosqueView[] = items.map((item) => {
    const resolvedStateName = item.state_name || formatLocationName(item.state_id);
    const resolvedCityName = item.city_name || formatLocationName(item.city_id);

    return {
      id: item.id,
      name: item.name,
      image_path: item.thumbnail_url ?? null,
      country_name: item.country_name ?? item.country_id?.toUpperCase() ?? null,
      state_id: item.state_id,
      city_id: item.city_id,
      state_name: resolvedStateName,
      city_name: resolvedCityName,
    };
  });

  return { data: mosqueViews, count: total };
}

export async function fetchMasjidByIdFromApi(id: number): Promise<Mosque | null> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/masjids/${id}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API error fetching masjid ${id}: ${res.status} ${res.statusText}`);
  }

  const detail = (await res.json()) as ApiMasjidDetail;

  const imageUrls: string[] = [];
  let thumbnailUrl: string | null = null;

  if (detail.images && detail.images.length > 0) {
    const thumbObj = detail.images.find((img) => img.is_thumbnail === 1) ?? detail.images[0];
    thumbnailUrl = thumbObj.full_url ?? thumbObj.thumbnail_url ?? thumbObj.path ?? null;

    for (const img of detail.images) {
      const url = img.full_url ?? img.thumbnail_url ?? img.path;
      if (url) imageUrls.push(url);
    }
  }

  const resolvedStateLabel = detail.state_name || formatLocationName(detail.state_id);
  const resolvedCityLabel = detail.city_name || formatLocationName(detail.city_id);

  return {
    id: detail.id,
    name: detail.name,
    thumbnailUrl,
    imageUrls: imageUrls.length > 0 ? imageUrls : null,
    description: detail.description,
    googleMapsEmbedded: null,
    googleMapsUrl: detail.google_url,
    latitude: detail.lat,
    longitude: detail.lng,
    address: detail.address,
    reviewsPerRating: null,
    countryId: detail.country_id,
    stateId: detail.state_id,
    cityId: detail.city_id,
    websiteUrl: null,
    phone: detail.telephone,
    category: detail.type_id,
    status: detail.status,
    addedByUserId: null,
    createdAt: detail.created_at ? new Date(detail.created_at) : null,
    updatedAt: detail.updated_at ? new Date(detail.updated_at) : null,
    state: detail.state_id ? { id: detail.state_id, label: resolvedStateLabel } : null,
    city: detail.city_id ? { id: detail.city_id, label: resolvedCityLabel } : null,
  };
}

export async function fetchCountriesFromApi() {
  return [
    { id: "my", name: "Malaysia", code: "MY" },
    { id: "sg", name: "Singapore", code: "SG" },
    { id: "bn", name: "Brunei", code: "BN" },
    { id: "id", name: "Indonesia", code: "ID" },
  ];
}

export async function fetchStatesFromApi(countryId: string = "my") {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/states?country=${countryId}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`API error fetching states: ${res.status}`);
  }

  const json = (await res.json()) as { data: Array<{ id: string; name: string; country_id: string }> };
  return json.data ?? [];
}

export async function fetchCitiesFromApi(stateId: string) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/cities?state=${stateId}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`API error fetching cities: ${res.status}`);
  }

  const json = (await res.json()) as { data: Array<{ id: string; name: string; state_id: string }> };
  return json.data ?? [];
}
