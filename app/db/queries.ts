import { cache } from "react";
import { getDb } from "./index";

export type { Mosque } from "@/types/Mosque";

export const getMasjidById = cache(async (id: number) => {
  const db = getDb();
  const data = await db
    .prepare(
      `SELECT
        m.*,
        s.name AS state_name,
        c.name AS city_name
      FROM masjids m
      LEFT JOIN states s ON s.id = m.state_id
      LEFT JOIN cities c ON c.id = m.city_id
      WHERE m.id = ? AND m.status = 'active'
      LIMIT 1`
    )
    .bind(id)
    .first<{
      id: number;
      name: string;
      description: string | null;
      address: string | null;
      lat: number;
      lng: number;
      country_id: string;
      state_id: string;
      city_id: string | null;
      type_id: string;
      status: string;
      telephone: string | null;
      email: string | null;
      google_url: string | null;
      created_at: string | null;
      updated_at: string | null;
      state_name: string | null;
      city_name: string | null;
    }>();

  if (!data) return null;

  const images = await db
    .prepare(
      `SELECT path, is_thumbnail
       FROM masjid_images
       WHERE masjid_id = ?
       ORDER BY is_thumbnail DESC, sort_order ASC, id ASC`
    )
    .bind(id)
    .all<{ path: string; is_thumbnail: number }>();

  const imageRows = images.results ?? [];
  const thumbnail = imageRows.find((image) => image.is_thumbnail)?.path ?? imageRows[0]?.path ?? null;

  return {
    id: data.id,
    name: data.name,
    thumbnailUrl: thumbnail,
    imageUrls: imageRows.map((image) => image.path),
    description: data.description,
    googleMapsEmbedded: null,
    googleMapsUrl: data.google_url,
    latitude: data.lat,
    longitude: data.lng,
    address: data.address,
    reviewsPerRating: null,
    countryId: data.country_id,
    stateId: data.state_id,
    cityId: data.city_id,
    websiteUrl: null,
    phone: data.telephone,
    category: data.type_id,
    status: data.status,
    addedByUserId: null,
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    state: data.state_id ? { id: data.state_id, label: data.state_name } : null,
    city: data.city_id ? { id: data.city_id, label: data.city_name } : null,
  };
});

export const getCountries = cache(async () => {
  const { results } = await getDb()
    .prepare("SELECT id, name, code FROM countries ORDER BY name")
    .all();
  return results || [];
});

export const getStates = cache(async (countryId = "my") => {
  const { results } = await getDb()
    .prepare("SELECT id, name, country_id FROM states WHERE country_id = ? ORDER BY name")
    .bind(countryId)
    .all();
  return results || [];
});

export const getStateById = cache(async (id: string) => {
  return getDb()
    .prepare("SELECT id, name, country_id FROM states WHERE id = ? LIMIT 1")
    .bind(id)
    .first();
});

export const getCities = cache(async (stateId: string) => {
  const { results } = await getDb()
    .prepare("SELECT id, name, state_id FROM cities WHERE state_id = ? ORDER BY name")
    .bind(stateId)
    .all();
  return results || [];
});

export const getCityById = cache(async (id: string) => {
  return getDb()
    .prepare("SELECT id, name, state_id FROM cities WHERE id = ? LIMIT 1")
    .bind(id)
    .first();
});
