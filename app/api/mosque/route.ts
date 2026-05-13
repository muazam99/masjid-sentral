import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const offset = (page - 1) * limit;
  const countryId = searchParams.get("countryId");
  const stateId = searchParams.get("stateId");
  const cityId = searchParams.get("cityId");
  const name = searchParams.get("q");

  let query = supabase
    .from('mosque_list_view')
    .select('*', { count: 'exact' });

  // Apply filters
  if (stateId) {
    query = query.eq('state_id', parseInt(stateId));
  } else if (countryId) {
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('id')
      .eq('country_id', parseInt(countryId));

    if (statesError) {
      return NextResponse.json({ error: statesError.message }, { status: 400 });
    }

    const stateIds = states?.map((state) => state.id) || [];
    if (stateIds.length === 0) {
      return NextResponse.json({ page, limit, data: [], count: 0 });
    }

    query = query.in('state_id', stateIds);
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
