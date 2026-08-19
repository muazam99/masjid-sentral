import { NextRequest, NextResponse } from "next/server";
import { fetchMasjidsFromApi } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const countryId = searchParams.get("countryId");
    const stateId = searchParams.get("stateId");
    const cityId = searchParams.get("cityId");
    const q = searchParams.get("q");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusParam = searchParams.get("radius");

    const lat = latParam ? parseFloat(latParam) : null;
    const lng = lngParam ? parseFloat(lngParam) : null;
    const radius = radiusParam ? parseFloat(radiusParam) : null;

    const { data, count } = await fetchMasjidsFromApi({
      page,
      limit,
      countryId,
      stateId,
      cityId,
      q,
      lat,
      lng,
      radius,
    });

    return NextResponse.json({ page, limit, data, count });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch mosques: ${error}` },
      { status: 500 }
    );
  }
}
