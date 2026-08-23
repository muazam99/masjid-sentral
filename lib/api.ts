import { Mosque, MosqueView } from "@/types/Mosque";
import { Submission } from "@/types/Submission";

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
  facilities?: string[];
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
  lat?: number | null;
  lng?: number | null;
  radius?: number | null;
}): Promise<{ data: MosqueView[]; count: number }> {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();

  // If lat & lng are specified, query the nearby endpoint
  const isNearbyQuery =
    typeof options.lat === 'number' &&
    typeof options.lng === 'number' &&
    !isNaN(options.lat) &&
    !isNaN(options.lng);

  let endpoint = '/masjids';

  if (isNearbyQuery) {
    endpoint = '/masjids/nearby';
    params.set('lat', options.lat!.toString());
    params.set('lng', options.lng!.toString());
    if (options.radius) {
      params.set('radius', Math.min(20, Math.max(1, options.radius)).toString());
    }
  } else {
    if (options.page) params.set("page", options.page.toString());
    if (options.limit) params.set("limit", options.limit.toString());
    if (options.countryId && options.countryId !== 'all') params.set("country", options.countryId);
    if (options.stateId && options.stateId !== 'all') params.set("state", options.stateId);
    if (options.cityId && options.cityId !== 'all') params.set("city", options.cityId);
    if (options.type) params.set("type", options.type);
    if (options.jumaat) params.set("jumaat", "1");
    if (options.q) params.set("q", options.q);
  }

  const res = await fetch(`${baseUrl}${endpoint}?${params.toString()}`, {
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
      address: item.address ?? null,
      lat: item.lat ?? null,
      lng: item.lng ?? null,
      type_id: item.type_id ?? null,
      status: item.status ?? null,
      jumaat_available: item.jumaat_available ?? null,
      facilities: item.facilities ?? [],
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

  // Compute rating breakdown (1-5 stars)
  const reviewsPerRating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (detail.reviews && detail.reviews.length > 0) {
    for (const r of detail.reviews) {
      const star = Math.max(1, Math.min(5, Math.round(r.rating)));
      reviewsPerRating[star] = (reviewsPerRating[star] || 0) + 1;
    }
  }

  // Find website url from contacts if present
  const websiteContact = detail.contacts?.find((c) => c.type === 'website');

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
    reviewsPerRating,
    countryId: detail.country_id,
    stateId: detail.state_id,
    cityId: detail.city_id,
    countryName: detail.country_name || (detail.country_id ? detail.country_id.toUpperCase() : null),
    stateName: resolvedStateLabel,
    cityName: resolvedCityLabel,
    websiteUrl: websiteContact ? websiteContact.value : null,
    phone: detail.telephone,
    email: detail.email,
    category: detail.type_id,
    status: detail.status,
    jumaatAvailable: detail.jumaat_available === 1,
    addedByUserId: null,
    createdAt: detail.created_at ? new Date(detail.created_at) : null,
    updatedAt: detail.updated_at ? new Date(detail.updated_at) : null,
    state: detail.state_id ? { id: detail.state_id, label: resolvedStateLabel } : null,
    city: detail.city_id ? { id: detail.city_id, label: resolvedCityLabel } : null,
    facilities: detail.facilities || [],
    contacts: detail.contacts || [],
    reviews: (detail.reviews || []).map((r) => ({
      ...r,
      user_name: r.source_app ? `Contributor (${r.source_app})` : 'Community Contributor',
      user_initial: (r.source_app || 'C').charAt(0).toUpperCase(),
    })),
    events: (detail.events || []).map((e) => ({
      ...e,
      location: 'Main Hall',
    })),
    avgRating: detail.avg_rating ?? null,
    reviewCount: detail.review_count ?? (detail.reviews ? detail.reviews.length : 0),
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

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Admin: Create Masjid ──────────────────────────────────────────────────

export type CreateMasjidPayload = {
  name: string;
  type_id: string;
  state_id: string;
  country_id: string;
  lat: number;
  lng: number;
  address: string;
  source: string;
  city_id?: string | null;
  description?: string | null;
  telephone?: string | null;
  email?: string | null;
  google_url?: string | null;
  jumaat_available?: boolean;
  facilities?: string[];
  contacts?: { type: string; value: string }[];
  images?: { path: string; is_thumbnail: boolean; sort_order: number }[];
  sedekah?: {
    enabled: boolean;
    qr_image_path?: string | null;
    qr_content?: string | null;
    payment_label?: string | null;
    instructions?: string | null;
  };
  organization_contacts?: {
    role: string;
    description?: string | null;
    parent_ref?: number | null;
    sort_order?: number;
  }[];
};

export async function requestImageUploadUrl(): Promise<{ id: string; uploadURL: string }> {
  const res = await fetch("/api/admin/images/upload-url", { method: "POST" });
  const body = (await res.json().catch(() => null)) as
    | { id?: string; uploadURL?: string; error?: string }
    | null;
  if (!res.ok || !body?.id || !body?.uploadURL) {
    throw new Error(body?.error || `Failed to get an upload URL (${res.status})`);
  }
  return { id: body.id, uploadURL: body.uploadURL };
}

// Uploads a file straight to Cloudflare Images using a direct-upload URL, and returns the
// image id to store as `path` in masjid_images / masjid_sedekah.qr_image_path.
export async function uploadImageFile(file: File): Promise<string> {
  const { id, uploadURL } = await requestImageUploadUrl();
  const formData = new FormData();
  formData.append("file", file);

  const uploadRes = await fetch(uploadURL, { method: "POST", body: formData });
  if (!uploadRes.ok) {
    throw new Error(`Image upload failed (${uploadRes.status})`);
  }
  return id;
}

// ─── Submissions (user-submitted new masjids / edits, pending admin review) ─

export async function submitMasjidCreate(payload: CreateMasjidPayload): Promise<Submission> {
  const res = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "create", payload }),
  });
  const body = (await res.json().catch(() => null)) as (Submission & { error?: undefined }) | { error?: string } | null;
  if (!res.ok || !body) {
    throw new Error((body as { error?: string } | null)?.error || `Failed to submit (${res.status})`);
  }
  return body as Submission;
}

export async function submitMasjidUpdate(
  masjidId: number,
  payload: Partial<CreateMasjidPayload>
): Promise<Submission> {
  const res = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "update", masjid_id: masjidId, payload }),
  });
  const body = (await res.json().catch(() => null)) as (Submission & { error?: undefined }) | { error?: string } | null;
  if (!res.ok || !body) {
    throw new Error((body as { error?: string } | null)?.error || `Failed to submit (${res.status})`);
  }
  return body as Submission;
}

export async function fetchMySubmissions(): Promise<Submission[]> {
  const res = await fetch("/api/submissions");
  if (!res.ok) throw new Error(`Failed to load submissions (${res.status})`);
  const body = (await res.json()) as { data: Submission[] };
  return body.data ?? [];
}

export async function fetchAdminSubmissions(status?: string): Promise<Submission[]> {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`/api/admin/submissions${params}`);
  if (!res.ok) throw new Error(`Failed to load submissions (${res.status})`);
  const body = (await res.json()) as { data: Submission[] };
  return body.data ?? [];
}

export async function approveSubmission(id: number): Promise<void> {
  const res = await fetch(`/api/admin/submissions/${id}/approve`, { method: "POST" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Failed to approve (${res.status})`);
  }
}

export async function rejectSubmission(id: number, reviewNote: string): Promise<void> {
  const res = await fetch(`/api/admin/submissions/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review_note: reviewNote }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Failed to reject (${res.status})`);
  }
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
