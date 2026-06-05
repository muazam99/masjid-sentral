import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const offset = (page - 1) * limit;
  const countryId = searchParams.get("countryId");
  const stateId = searchParams.get("stateId");
  const cityId = searchParams.get("cityId");
  const name = searchParams.get("q");

  const where: string[] = ["m.status = 'active'"];
  const bindings: Array<string | number> = [];

  if (stateId) {
    where.push("m.state_id = ?");
    bindings.push(stateId);
  } else if (countryId) {
    where.push("m.country_id = ?");
    bindings.push(countryId);
  }
  if (cityId) {
    where.push("m.city_id = ?");
    bindings.push(cityId);
  }
  if (name) {
    where.push("LOWER(m.name) LIKE LOWER(?)");
    bindings.push(`%${name}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const db = getDb();

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS count FROM masjids m ${whereSql}`)
    .bind(...bindings)
    .first<{ count: number }>();

  const { results } = await db
    .prepare(
      `SELECT
        m.id,
        m.name,
        thumb.path AS image_path,
        co.name AS country_name,
        m.state_id,
        m.city_id,
        s.name AS state_name,
        c.name AS city_name
      FROM masjids m
      LEFT JOIN countries co ON co.id = m.country_id
      LEFT JOIN states s ON s.id = m.state_id
      LEFT JOIN cities c ON c.id = m.city_id
      LEFT JOIN masjid_images thumb
        ON thumb.masjid_id = m.id
        AND thumb.is_thumbnail = 1
      ${whereSql}
      GROUP BY m.id
      ORDER BY m.name
      LIMIT ? OFFSET ?`
    )
    .bind(...bindings, limit, offset)
    .all();

  return NextResponse.json({ page, limit, data: results ?? [], count: countRow?.count ?? 0 });
}
