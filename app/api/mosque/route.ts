import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const offset = (page - 1) * limit;
  const stateId = searchParams.get("stateId");
  const cityId = searchParams.get("cityId");
  const name = searchParams.get("q");

  let query = supabase
    .from('mosque_list_view')
    .select('*', { count: 'exact' });

  // Apply filters
  if (stateId) {
    query = query.eq('state_id', parseInt(stateId));
  }
  if (cityId) {
    query = query.eq('city_id', parseInt(cityId));
  }
  if (name) {
    query = query.ilike('name', `%${name}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ page, limit, data, count });
}
